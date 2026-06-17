import React from "react";

const Order = ({ cart }) => {
  return (
    <div>
      <h2>Cart Items</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item, index) => (
          <p key={index}>
            {item.name} - ₹{item.price}
          </p>
        ))
      )}
    </div>
  );
};

export default Order;