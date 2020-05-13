import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleCartClick = this.handleCartClick.bind(this);
  }

  handleCartClick() {
    this.props.setView('cart', {});
  }

  render() {
    const { cartItemCount } = this.props;

    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="fas fa-dollar-sign"></i>&nbsp;Wicked Sales
          </a>
          <span className="navbar-text" onClick={this.handleCartClick} style={{ cursor: 'pointer' }}>
            { cartItemCount > 1 ? `${cartItemCount} items` : `${cartItemCount} item` } <i className="fas fa-shopping-cart"></i>
          </span>
        </div>
      </nav>
    );
  }
}

export default Header;
