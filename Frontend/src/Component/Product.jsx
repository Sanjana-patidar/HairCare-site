import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid,  Navigation } from "swiper/modules";
import {useNavigate} from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import axios from "axios";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
     const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/all?status=active`);
        setProducts(response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="multi-product p-4">
      <div className="mb-4">
        <h3  className="text-center" style={{color:"rgb(195, 229, 43)"}}>All Products</h3>
      </div>
      <div className="swiper-buttons text-end mb-3">
        <span onClick={() => navigate('/allproducts')} style={{cursor: "pointer"}} className="more-product-link">More Product</span>
        <button className="custom-prev">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="custom-next">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <Swiper
        modules={[Grid,  Navigation]}
        slidesPerView={5}
        grid={{ rows: 1 }}
        spaceBetween={20}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          500: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024:{ slidesPerView: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div  className="product-card text-center">
              <div>
                <img
                  className="w-75"
                  src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                  alt={product.name}
                />
                <h6>{product.name}</h6>
                <p className="description">{product.description}</p>
                <p>
                  <span>₹{product.discountprice}</span>{" "}
                   <del className="text-secondary">₹{product.price}</del>
                  <span className="ps-2">{product.discountpercentage}%</span>
                </p>
                <Box sx={{ "& > legend": { mt: 2 } }}>
                  <Rating
                    value={product.rating }
                  />
                </Box>
                  <button onClick={()=> navigate(`/productdetail/${product._id}`)}  className="w-100 add-to-cart-btn">
                    Product Detail <i className="fa-solid fa-arrow-right"></i>
                  </button>
              </div>
              <div className="like-btn">
                {wishlistItems.some(item => item._id === product._id) ? (
                  <i className="fa-solid fa-heart text-danger hvr-grow" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                ) : (
                  <i className="fa-regular fa-heart hvr-grow" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                )}
                <p style={{color:"rgb(192, 223, 54)"}} >stock:{product._id ? product.stock : product.stock}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Product;
