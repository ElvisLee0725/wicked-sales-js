import React from 'react';

function ProductListItem(props) {
  return (
    <div className="col-12 col-sm-6 col-md-4 mb-4">
      <div className="card h-100">
        <img src={props.data.image} className="card-img-top" style={{ objectFit: 'contain', height: '40vh' }} alt={props.data.name} />
        <div className="card-body">
          <h5 className="card-title">{props.data.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">${props.data.price / 100}</h6>
          <p className="card-text">{props.data.shortDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductListItem;
