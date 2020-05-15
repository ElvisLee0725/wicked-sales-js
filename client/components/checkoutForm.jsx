import React from 'react';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBackToCart = this.handleBackToCart.bind(this);
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
    this.state = {
      shopperName: '',
      creditCard: '',
      shippingAddress: ''
    };
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }

  handleBackToCart() {
    this.props.setView('catalog', {});
  }

  handlePlaceOrder(e) {
    e.preventDefault();
    const { shopperName, creditCard, shippingAddress } = this.state;

    this.props.placeOrder({
      name: shopperName,
      creditCard,
      shippingAddress
    });
  }

  render() {
    const totalAmount = this.props.cart.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    return (
      <div className="container mt-5 mb-5">
        <h1 className="mt-4 mb-4">My Cart</h1>
        <h5 className="mb-4">Order Total: ${totalAmount / 100}</h5>

        <form>
          <div className="form-group">
            <label htmlFor="shopperName">Name</label>
            <input type="text" className="form-control" id="shopperName" name="shopperName" value={this.state.shopperName} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="creditCard">Credit Card</label>
            <input type="text" className="form-control" id="creditCard" name="creditCard" value={this.state.creditCard}onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea className="form-control" id="shippingAddress" name="shippingAddress" value={this.state.shippingAddress} onChange={this.handleChange} rows="5"></textarea>
          </div>
          <small className="text-muted" onClick={this.handleBackToCart} style={{ cursor: 'pointer' }}>
            <i className="fa fa-chevron-left"></i>&nbsp;Continue Shopping
          </small>
          <button type="button" className="btn btn-primary float-right" onClick={this.handlePlaceOrder}>Place Order</button>
        </form>
      </div>
    );
  }
}

export default CheckoutForm;
