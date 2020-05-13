import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.state = {
      message: null,
      isLoading: true,
      cart: [],
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

    this.getCartItems();
  }

  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => {
        return res.json();
      })
      .then(cartItems => {
        this.setState({
          cart: [
            ...this.state.cart,
            ...cartItems
          ]
        });
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  addToCart(product) {
    const body = JSON.stringify({ productId: product });

    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          cart: [
            ...this.state.cart,
            data
          ]
        });
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  render() {
    const { view } = this.state;
    let content = null;
    if (view.name === 'catalog') {
      content = <ProductList setView={this.setView}/>;
    } else if (view.name === 'details') {
      content = <ProductDetails params={view.params} setView={this.setView} addToCart={this.addToCart}/>;
    }

    return (
      <div>
        <Header cartItemCount={this.state.cart.length}/>
        { content }
      </div>
    );
  }
}
