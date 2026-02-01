import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import axios from "axios";
import './Style.css'

const shampoo = () => {
  const [products, setProducts] = useState([]);
   const navigate = useNavigate();
  useEffect(() => {
      const fetchOilProducts = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/products/category/shampoo`
          );
          setProducts(res.data);
        } catch (error) {
          console.error(error);
        }
      };
  fetchOilProducts();
  
  }, []);
  return (
    <div data-aos="zoom-in">
      <div className="text-center mt-3 mb-3">
        <span className="back"  style={{color:"rgb(192, 223, 54)"}}>
         <Link to="/"  style={{color:"rgb(192, 223, 54)"}} >
            <i class="fa-solid fa-arrow-left me-2"></i> 
         </Link>
          Back to Home</span>
        <h3 className="mt-2 header-top">Hair Shampoo</h3>
      </div>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
              <div key={product._id} className="product-card text-center">
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
                <i className="fa-regular fa-heart"></i>
                <p style={{color:"rgb(192, 223, 54)"}} >stock:{product.stock}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No Product Related to Category </p>
        )}
      </div>
    </div>
  );
};

export default shampoo;
