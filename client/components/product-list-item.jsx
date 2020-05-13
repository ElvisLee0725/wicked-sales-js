import React from 'react';

class ProductListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleProductClick = this.handleProductClick.bind(this);
  }

  handleProductClick() {
    this.props.setView('details', { productId: this.props.data.productId });
  }

  render() {
    return (
      <div className="col-12 col-sm-6 col-md-4 mb-4">
        <div className="card h-100" onClick={this.handleProductClick}>
          <img src={this.props.data.image} className="card-img-top" style={{ objectFit: 'contain', height: '40vh' }} alt={this.props.data.name} />
          <div className="card-body">
            <h5 className="card-title">{this.props.data.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">${this.props.data.price / 100}</h6>
            <p className="card-text">{this.props.data.shortDescription}</p>
            <a href="#" className="stretched-link"></a>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListItem;
