import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import "./CartOffcanvas.css";

const CartOffcanvas = ({ isOpen, closeCart }) => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const totalProducts = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subTotalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.discountprice, 0);

  return (
    <>
      {isOpen && <div className="overlay" onClick={closeCart}></div>}

      <div  className={`cart-offcanvas ${isOpen ? "show" : ""}`}>
        <div className="cart-header">
          <h5>My CART</h5>
          <button onClick={closeCart} className="cart-close-btn" >✕</button>
        </div>
        <p className="m-0 mt-2 ps-3" style={{color:"rgb(195, 229, 43)"}}>Total Product: {totalProducts}</p>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <img
              className="w-100"
              src="/src/assets/img/empty-cart-1.png"
              alt=""
            />
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-container p-2">
                <div className="cart-bg row justify-content-center align-items-center">
                  <div className="col-12 col-sm-4">
                    <img className="w-100"
                    src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`}
                    alt=""
                  />
                  </div>
                  <div className=" col-12 col-sm-8">
                    <h6>{item.name}</h6>
                    <p className="m-0"> Price: ₹{item.discountprice}</p>
                    <p className="m-0" > Product Quantity: {item.quantity}</p>
                    <p onClick={() => removeFromCart(item._id)}> Remove From Cart: <i class="fa-solid fa-trash "></i></p>
                    <div className="qty-box">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQty(item._id)}
                      ><i class="fa-solid fa-minus"></i></button>
                      <span>{item.quantity}</span>

                      <button
                        className="qty-btn"
                        onClick={() => increaseQty(item._id)}
                      ><i class="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="mb-2">
              <p className="m-0 fw-bold">Total Quntity:  {totalQuantity}</p>
              <p className="fw-bold">SubTotal Price:  ₹{subTotalPrice}</p>
            </div>
          <Link to="/Checkout">
            <button onClick={closeCart} className="checkout-btn">Checkout</button>
          </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartOffcanvas;
