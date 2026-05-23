import React from 'react'
import { useCart } from "../Context/CartContext";
import axios from "axios";
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import confetti from "canvas-confetti";
import BackButton from '../Component/BackButton';
import './Checkout.css'

const Checkout = () => {
  const token = localStorage.getItem("token");
  const { removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

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
    (sum, item) => sum + item.discountprice * item.quantity,
    0
  );

  const handleLike = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const discount = 0;
  const grandTotal = totalAmount - discount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data) {
          if (res.data.email) setUserEmail(res.data.email);
          if (res.data.addresses) setSavedAddresses(res.data.addresses);
        }
      })
      .catch(err => console.error("Failed to fetch user profile", err));
    }
  }, [token]);

  const handleSelectAddress = (addr, index) => {
    setSelectedAddressIndex(index);
    const nameParts = addr.name ? addr.name.split(" ") : [""];
    setForm({
      ...form,
      firstname: nameParts[0] || "",
      lastname: nameParts.slice(1).join(" ") || "",
      email: userEmail || form.email,
      phone: addr.phoneNo || "",
      address: addr.address || "",
      city: addr.city || "",
      pincode: addr.pincode || "",
    });
  };

  const placeOrder = async () => {
    // 🔒 Check if user is logged in
    if (!token) {
      Swal.fire({ icon: "warning", title: "Please login to place an order" });
      navigate("/login");
      return;
    }

    // Validate all required fields
    if (!form.firstname || !form.lastname || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      Swal.fire({ icon: "warning", title: "Please fill all required fields" });
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({ icon: "warning", title: "Your cart is empty!" });
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Products sent to backend use discountprice as the price
    const productsForOrder = cartItems.map(item => ({
      product: item._id, // ✅ Critical for stock deduction
      name: item.name,
      price: Number(item.discountprice),
      quantity: Number(item.quantity),
      image: item.image,
    }));

    const orderData = {
      customer: form,
      products: productsForOrder,
      totalAmount: totalAmount,
    };

    try {
      // 🟢 COD FLOW
      if (paymentMethod === "COD") {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders/place`,
          { ...orderData, paymentMethod: "COD" },
          config
        );

        if (res.data.success) {
          handleLike();
          Swal.fire({
            icon: "success",
            title: "Order Placed Successfully 🎉",
          }).then(() => {
            clearCart();
            navigate("/Placeorder");
          });
        }
      }

      // 🔵 ONLINE FLOW (RAZORPAY)
      else if (paymentMethod === "ONLINE") {
        // ✅ Check Razorpay SDK is loaded
        if (!window.Razorpay) {
          Swal.fire({
            icon: "error",
            title: "Payment Error",
            text: "Razorpay SDK failed to load. Please refresh the page and try again.",
          });
          return;
        }

        // 1️⃣ Create Razorpay order
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/payment/create-order`,
          { amount: totalAmount },
          config
        );

        const { id, amount, currency } = res.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency,
          order_id: id,
          name: "HairCare",
          description: "Order Payment",
          theme: { color: "#3399cc" },

          handler: async function (response) {
            try {
              // 2️⃣ Verify payment & save order
              await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData,
                },
                config
              );

              handleLike();
              Swal.fire({
                icon: "success",
                title: "Payment Successful 🎉",
              }).then(() => {
                clearCart();
                navigate("/Placeorder");
              });
            } catch (verifyErr) {
              console.error("Payment verify error:", verifyErr);
              const msg = verifyErr.response?.data?.message || "Payment verification failed. Contact support.";
              Swal.fire({ icon: "error", title: "Payment Error", text: msg });
            }
          },

          prefill: {
            name: form.firstname,
            email: form.email,
            contact: form.phone,
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Order error:", err);
      // Show the actual server error message if available
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Order failed. Please try again.";
      Swal.fire({ icon: "error", title: "Order Failed", text: msg });
    }
  };


  return (
    <div className="checkout-container p-2">
      <BackButton />
      <div className="row">
        <div className="col-12 col-md-6 fixed">
            <div className=' p-3'>
               <h4>Billing Detail</h4>

               {/* Saved Addresses Section */}
               {savedAddresses.length > 0 && (
                 <div className="saved-addresses mb-4">
                   <p className="fw-bold mb-2 text-secondary">Quick Select Saved Address:</p>
                   <div className="d-flex flex-wrap gap-2">
                     {savedAddresses.map((addr, idx) => (
                       <button
                         key={addr._id || idx}
                         className={`btn btn-sm ${selectedAddressIndex === idx ? 'btn-primary' : 'btn-outline-primary'}`}
                         onClick={() => handleSelectAddress(addr, idx)}
                       >
                         {addr.addressType || "Home"} - {addr.city}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               <div className="form-container">
                 <div>
                   <div className='d-flex flex-column flex-sm-row gap-3'>
                    <div className='w-100'>
                      <label>First Name <span style={{color:"red"}}>*</span></label><br />
                      <input name="firstname" type="text" placeholder='Enter your first name...' value={form.firstname} onChange={handleChange}/>
                   </div>
                   <div className='w-100'>
                      <label>Last Name <span style={{color:"red"}}>*</span></label><br />
                      <input name="lastname" type="text" placeholder='Enter your last name...' value={form.lastname} onChange={handleChange} />
                   </div>
                   </div>
                   <div className='d-flex flex-column flex-sm-row gap-3'>
                    <div className='w-100'>
                      <label>Email <span style={{color:"red"}}>*</span></label><br />
                      <input name="email" type="text" placeholder='email@gmail.com' value={form.email} onChange={handleChange} />
                   </div>
                   <div className='w-100'>
                      <label>Phone Number <span style={{color:"red"}}>*</span></label><br />
                      <input name="phone" type="text" inputMode="numeric" placeholder='9119675097' value={form.phone} onChange={handleChange} />
                   </div>

                   </div>
                    <div>
                      <label>Address  <span style={{color:"red"}}>*</span></label><br />
                      <textarea name="address" placeholder='address' value={form.address} onChange={handleChange} ></textarea>
                    </div>
                    <div>
                      <label>Town/City  <span style={{color:"red"}}>*</span></label><br />
                      <input name="city" type="text" placeholder='city' value={form.city} onChange={handleChange} />
                   </div>
                   <div>
                      <label>Pincode  <span style={{color:"red"}}>*</span></label><br />
                      <input name="pincode" type="text" inputMode="numeric" placeholder='pincode' value={form.pincode} onChange={handleChange} />
                   </div>
                   <div className="payment-method">
  <h5>Select Payment Method</h5>

  <label className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}>
    <input
      type="radio"
      value="COD"
      checked={paymentMethod === "COD"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <div className="payment-content">
      <span className="icon">💵</span>
      <div>
        <p className="title">Cash on Delivery</p>
        <p className="desc">Pay when your order arrives</p>
      </div>
    </div>
  </label>

  <label className={`payment-option ${paymentMethod === "ONLINE" ? "active" : ""}`}>
    <input
      type="radio"
      value="ONLINE"
      checked={paymentMethod === "ONLINE"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <div className="payment-content">
      <span className="icon">💳</span>
      <div>
        <p className="title">Online Payment</p>
        <p className="desc">Pay securely via Razorpay</p>
      </div>
    </div>
  </label>
</div>
                    <div>
                       <button onClick={placeOrder} className='placeorder-btn'>Place Order</button>
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
                     <div key={item._id} className="row border p-3 rounded-2 mb-3 bg-white">
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
