import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackToCatalog = this.handleBackToCatalog.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.state = {
      product: null
    };
  }

  componentDidMount() {
    fetch(`/api/products/${this.props.params.productId}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          product: data
        });
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  handleBackToCatalog() {
    this.props.setView('catalog', {});
  }

  handleAddToCart() {
    const { productId } = this.state.product;
    this.props.addToCart(productId);
  }

  render() {
    const { product } = this.state;
    return product && (
      <div className="container">
        <div className="card mt-5 mb-5">
          <div className="card-header">
            <small className="text-muted" onClick={this.handleBackToCatalog} style={{ cursor: 'pointer' }}>
              <i className="fa fa-chevron-left"></i>&nbsp;Back to catalog
            </small>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <img className="card-img-top" src={product.image} style={{ objectFit: 'contain', height: '40vh' }} alt={product.name} />
            </div>
            <div className="col-12 col-sm-6">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">${product.price / 100}</h6>
                <p className="card-text">{product.shortDescription}</p>
                <button className="btn btn-primary" onClick={this.handleAddToCart}>Add to Cart</button>
              </div>
            </div>
            <div className="col-12">
              <div className="card-body">
                <p>{product.longDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetails;
