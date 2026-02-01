import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useCart } from '../Context/CartContext';
import { useOutletContext } from "react-router-dom";
import confetti from "canvas-confetti";
import "./Productdetail.css"


const Productdetail = () => {
  const handleLike = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };
  //state for rating
      const [value, setValue] = useState(2);
      const {id} = useParams();
      const [product, setProduct] = useState(null);
      // usecart context
      const { openCart } = useOutletContext();
      const { cartItems, addToCart } = useCart();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);
   if (!product) return <h2>Loading...</h2>;
   const cartItem = cartItems.find((item) => item._id === product._id);
   const handleAddToCart = () => {
   const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
     toast.warning("Login first to add this product in cart!");
    return; // stop execution if not logged in
  }
  if (cartItem) {
     toast.warning("This product is already in cart");
  } else {
    addToCart(product);
    toast.success("Product added to cart");
  }
};

  return (
    <div data-aos="zoom-in" className='product-detail-section'>
        <div className="row p-5 justify-content-center  ">
          <div className="col-12 col-md-12 col-lg-5 ">
            <div className='border rounded text-center product-img-box'>
              <img className='w-100 rounded-4'
                  src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                  alt={product.name}
                />
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-7">
            <div className=" p-2">
              <div>
                <h4>{product.name}</h4>
                <span className="description">{product.description}</span>
                <p>A gentle, herbal shampoo enriched with Bhringraj & Amla that helps reduce hair fall, boost shine, and nourish your scalp from root to tip.</p>
              </div>
              <div className='advantage'>
                <ul className='list-unstyled'>
                  <li><i class="fa-regular fa-circle-check fa-check"></i> Reduces Hair Fall & Breakage</li>
                  <li><i class="fa-regular fa-circle-check fa-check"></i> Strengthens Roots & Adds Shine</li>
                  <li><i class="fa-regular fa-circle-check fa-check"></i> Sulphate & Paraben Free</li>
                  <li><i class="fa-regular fa-circle-check fa-check"></i> Suitable for All Hair Types</li>
                </ul>
              </div>
              <div>
                <h5 className='price' >Price: ₹{product.discountprice} <del className='original-price text-secondary'>₹{product.price}</del> <button  className='discount-btn'>{product.discountpercentage}% Off </button></h5>
              </div>
              <div>
                <h5>Stock: {product.stock} </h5>
              </div>
              <div>
                <h5 className='d-flex align-items-center'>Rating:
                <Rating value={product.rating } />
                </h5>
              </div>
              <div>
                 <div className='d-flex justify-content-between key'>
                     <div>Key Benifit</div>
                     <div className='toggle'><i data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" class="fa-solid fa-angle-down collapse-icon"></i> </div>
                 </div>
                 <div id="collapseExample" className="row gy-3 collapse" >
                  <div className="col-12 col-md-6">
                    <div className='border p-2 rounded-3'>
                      <h5><i class="fa-solid fa-square-check fa-check"></i> Reduces Hair Fall</h5>
                      <p>Strengthens hair roots and minimizes breakage with regular use.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className='border p-2 rounded-3'>
                       <h5><i class="fa-solid fa-square-check fa-check"></i> Adds Natural Shine</h5>
                       <p>Amla helps restore dull hair and gives a healthy, glossy finish.</p>
                    </div>
                  </div>
                 <div className="col-12 col-md-6">
                    <div className='border p-2 rounded-3'>
                       <h5><i class="fa-solid fa-square-check fa-check"></i> Deep Nourishment</h5>
                       <p>Nourishes scalp and hair strands without making hair dry.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className='border p-2 rounded-3'>
                       <h5><i class="fa-solid fa-square-check fa-check"></i> Gentle Daily Care</h5>
                       <p>Mild formula suitable for daily use on all hair types.</p>
                    </div>
                  </div>
                 </div>
              </div>
              <div className="cart-buy-btn mt-3 d-flex justify-content-between gap-4">
               <button
                 onClick={() => (handleAddToCart(), handleLike())}
                  className="discount-btn w-100"
                >
                   {cartItem ? " Already in Cart" : "Add to Cart"}
                </button>
               <button onClick={openCart} className='w-100 discount-btn'>View Cart <i class="fa-solid fa-bag-shopping"></i> </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Productdetail
