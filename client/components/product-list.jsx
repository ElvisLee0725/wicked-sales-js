import React from 'react';
import ProductListItem from './product-list-item';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          products: data
        });
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  render() {
    const { products } = this.state;
    return (
      <div className="container mt-5 mb-5">
        <div className="row">
          {
            products.map(product => {
              return <ProductListItem key={product.productId} data={product} />;
            })
          }
        </div>
      </div>
    );
  }
}

export default ProductList;
