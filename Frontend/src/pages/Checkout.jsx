import React from 'react'
import { useCart } from "../Context/CartContext";
import axios from "axios";
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import confetti from "canvas-confetti";
import './Checkout.css'

const Checkout = () => {
  const token = localStorage.getItem("token");
  const { removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const productsForBackend = cartItems.map(item => ({
  name: item.name,
  price: Number(item.price),
  quantity: Number(item.quantity),
  image: item.image
}));
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email:"",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.discountprice * item.quantity
,
    0
  );

  const handleLike = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    };
  const discount = cartItems.length > 0 ? 0 : 0;
  const grandTotal = totalAmount - discount;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const placeOrder = async () => {
    if (!form.firstname || !form.lastname || !form.phone || !form.address) {
      alert("Fill all required fields");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orders/place`, {
        customer: form,
        products: productsForBackend,
        totalAmount:totalAmount,
        paymentMethod: "COD",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Order Placed Successfully 🎉",
      text: "Your order has been placed successfully!",
    }).then(() => {
      clearCart();
      navigate("/Placeorder");
    });
     
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div className="checkout-container p-2">
      <div className="row">
        <div className="col-12 col-md-6 fixed">
            <div className=' p-3'>
               <h4>Billing Detail</h4>
               <div className="form-container">
                 <div>
                   <div className='d-flex flex-column flex-sm-row gap-3'>
                    <div className='w-100'>
                      <label>First Name <span style={{color:"red"}}>*</span></label><br />
                      <input name="firstname" type="text" placeholder='Enter your first name...' onChange={handleChange}/>
                   </div>
                   <div className='w-100'>
                      <label>Last Name <span style={{color:"red"}}>*</span></label><br />
                      <input name="lastname" type="text" placeholder='Enter your last name...' onChange={handleChange} />
                   </div>
                   </div>
                   <div className='d-flex flex-column flex-sm-row gap-3'>
                    <div className='w-100'>
                      <label>Email <span style={{color:"red"}}>*</span></label><br />
                      <input name="email" type="text" placeholder='email@gmail.com' onChange={handleChange} />
                   </div>
                   <div className='w-100'>
                      <label>Phone Number <span style={{color:"red"}}>*</span></label><br />
                      <input name="phone" type="number" placeholder='9119675097' onChange={handleChange} />
                   </div>

                   </div>
                    <div>
                      <label>Address  <span style={{color:"red"}}>*</span></label><br />
                      <textarea name="address" placeholder='address' onChange={handleChange} ></textarea>
                    </div>
                    <div>
                      <label>Town/City  <span style={{color:"red"}}>*</span></label><br />
                      <input name="city" type="text" placeholder='city' onChange={handleChange} />
                   </div>
                   <div>
                      <label>Pincode  <span style={{color:"red"}}>*</span></label><br />
                      <input name="pincode" type="number" placeholder='pincode' onChange={handleChange} />
                   </div>
                    <div>
                       <button onClick={()=>(placeOrder(),handleLike())} className='placeorder-btn' >Place Order</button>
                    </div>
                 </div>
               </div>
            </div>
        </div>
        <div className="col-12 col-md-6 order-product ">
          <div className=' p-3'>
            <h4>Your Order</h4>
            <div  className={` p-3 ${
            cartItems.length > 3 ? "order-container" : ""
             }`}>
              {cartItems.length === 0 ? (
                  <p>Your current order is empty 😦</p>
                ) : (
                  cartItems.map((item) => (
                     <div key={item._id} className="row border ">
                        <div className="col-2">
                            <div className=' bedge-rel   product-zoom border rounded'>
                              <img className='w-100 rounded ' src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`} alt="" />
                              <div className='bedge-abs'><span>{item.quantity}</span></div>
                            </div>
                          </div>
                          <div className="col-10 d-flex justify-content-between align-items-start">
                            <div >
                              <h6>{item.name}</h6>
                              <p className='m-0'>Price: ₹{item.discountprice}</p>
                            </div>
                            <div onClick={() => removeFromCart(item._id)} className='text-danger remove' >
                              Remove
                            </div>
                          </div>
                     </div>
                  ))
                )}
            </div>
            <div className='pyament-detail mt-3 border rounded-2 p-3 bg-white'>
              <h5>Payment Details</h5>
              <div border>
               <div d-flex justify-content-between>
                <p className='fw-bold mb-1 text-secondary'>Total  Quntity: {totalQuantity}</p>
                <p className='fw-bold mb-1 text-secondary'>Subtotal: ₹ {totalAmount}</p>
               </div>
               <p className='fw-bold mb-1 text-secondary'>Discount: {discount}</p>
               <p className='fw-bold mb-1 text-secondary'>  Grand Total : ₹ {grandTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout
