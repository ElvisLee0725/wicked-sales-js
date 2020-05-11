import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.setView = this.setView.bind(this);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
  }

  render() {
    const { view } = this.state;
    let content = null;
    if (view.name === 'catalog') {
      content = <ProductList setView={this.setView}/>;
    } else if (view.name === 'details') {
      content = <ProductDetails params={view.params} setView={this.setView} />;
    }

    return (
      <div>
        <Header />
        { content }
      </div>
    );
  }
}
