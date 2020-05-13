import React from 'react';

function CartSummaryItem(props) {
  const { image, name, price, shortDescription } = props.product;
  return (
    <div className="card mt-5 mb-5">
      <div className="row">
        <div className="col-12 col-sm-4">
          <img className="card-img-top" src={image} style={{ objectFit: 'contain', height: '35vh' }} alt={name} />
        </div>
        <div className="col-12 col-sm-8">
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">${price / 100}</h6>
            <p className="card-text">{shortDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSummaryItem;
