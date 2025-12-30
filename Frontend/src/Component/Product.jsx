import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid,  Navigation } from "swiper/modules";
import {useNavigate} from "react-router-dom";
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
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
     const response = await axios.get("http://localhost:5000/api/products/all?status=active");
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
        <h3 data-aos="fade-right" className="text-center" style={{color:"rgb(195, 229, 43)"}}>All Products</h3>
      </div>
      <div className="swiper-buttons text-end mb-3">
        <span>More Product</span>
        <button className="custom-prev">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="custom-next">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <Swiper
        modules={[Grid,  Navigation]}
        slidesPerView={4}
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
          1024:{ slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div data-aos="zoom-in" className="product-card text-center">
              <div>
                <img
                  className="w-75"
                  src={`http://localhost:5000/uploads/${product.image}`}
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
                <i className="fa-regular fa-heart"></i>
                <p style={{color:"rgb(192, 223, 54)"}} >stock:{product.stock}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Product;
