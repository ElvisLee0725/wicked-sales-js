import React from 'react';

function Header(props) {
  const { cartItemCount } = props;
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">
          <i className="fas fa-dollar-sign"></i>&nbsp;Wicked Sales
        </a>
        <span className="navbar-text">
          { cartItemCount > 1 ? `${cartItemCount} items` : `${cartItemCount} item` } <i className="fas fa-shopping-cart"></i>
        </span>
      </div>
    </nav>
  );
}

export default Header;
