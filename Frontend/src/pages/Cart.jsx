import React from 'react';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';
import emptyCartImg from '../assets/img/empty-cart-1.png';
import './Cart.css';

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const totalProducts = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subTotalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.discountprice, 0);

  return (
    <div className="cart-page-container">
      <div className="container py-5">
        <h2 className="cart-page-title mb-4">My Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="text-center empty-cart-wrapper">
            <img src={emptyCartImg} alt="Empty Cart" className="empty-cart-img" />
            <h4 className="mt-3">Your cart is empty!</h4>
            <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/allproducts">
              <button className="btn btn-primary px-4 py-2 mt-3" style={{ background: "rgb(192, 223, 54)", color: "#000", border: "none", fontWeight: "600" }}>
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="cart-items-list">
                <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                  <span className="text-muted fw-bold">Items ({totalProducts})</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-page-item mb-3">
                    <div className="row align-items-center">
                      <div className="col-4 col-md-2 text-center">
                        <img 
                          src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`} 
                          alt={item.name} 
                          className="cart-item-img img-fluid rounded" 
                        />
                      </div>
                      <div className="col-8 col-md-5">
                        <h5 className="cart-item-name">{item.name}</h5>
                        <p className="cart-item-price mb-2 text-muted">Price: <span className="fw-bold text-dark">₹{item.discountprice}</span></p>
                      </div>
                      <div className="col-12 col-md-5 mt-3 mt-md-0 d-flex justify-content-between align-items-center">
                        <div className="cart-qty-wrapper d-flex align-items-center">
                          <button className="qty-btn" onClick={() => decreaseQty(item._id)}>
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => increaseQty(item._id)}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                        <button className="btn btn-sm btn-outline-danger cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                          <i className="fa-solid fa-trash me-1"></i> <span className="d-none d-sm-inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="cart-summary-card p-4 rounded shadow-sm">
                <h4 className="border-bottom pb-3 mb-3">Order Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Quantity</span>
                  <span className="fw-bold">{totalQuantity} Items</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                  <span className="text-muted">Delivery Charges</span>
                  <span className="text-success fw-bold">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">SubTotal</span>
                  <span className="fs-5 fw-bold" style={{ color: "rgb(160, 190, 40)" }}>₹{subTotalPrice}</span>
                </div>
                
                <Link to="/Checkout">
                  <button className="w-100 btn py-3 cart-checkout-btn">
                    Proceed to Checkout
                  </button>
                </Link>
                <div className="text-center mt-3">
                  <Link to="/" className="text-decoration-none text-muted" style={{ fontSize: "14px" }}>
                    <i className="fa-solid fa-arrow-left me-1"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
