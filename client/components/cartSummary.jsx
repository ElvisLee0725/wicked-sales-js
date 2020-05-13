import React from 'react';
import CartSummaryItem from './cartSummaryItem';

class CartSummary extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackToCatalog = this.handleBackToCatalog.bind(this);
  }

  handleBackToCatalog() {
    this.props.setView('catalog', {});
  }

  render() {
    const { cart } = this.props;
    const totalAmount = cart.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    return (
      <div className="container mt-5 mb-5">
        <small className="text-muted" onClick={this.handleBackToCatalog} style={{ cursor: 'pointer' }}>
          <i className="fa fa-chevron-left"></i>&nbsp;Back to catalog
        </small>
        <h1 className="mt-4 mb-4">My Cart</h1>
        {
          cart.length === 0 ? <div className="nothing-in-cart">You have 0 item in your cart.</div> : cart.map(cartItem => {
            return <CartSummaryItem key={cartItem.productId} product={cartItem} />;
          })
        }
        <h3>Item Total: ${ totalAmount / 100}</h3>
      </div>
    );
  }

}

export default CartSummary;
