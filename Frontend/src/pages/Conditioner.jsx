import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useWishlist } from "../Context/WishlistContext";
import '../Component/Product.css';
import './Style.css';

const Conditioner = () => {
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/category/conditioner`
        );
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="text-center mt-4 mb-4">
        <Link to="/" style={{ color: "rgb(192, 223, 54)", textDecoration: "none" }}>
          <i className="fa-solid fa-arrow-left me-2"></i>Back to Home
        </Link>
        <h3 className="mt-2 header-top">Hair Conditioner</h3>
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="pc-img-wrap" onClick={() => navigate(`/productdetail/${product._id}`)}>
                <img
                  src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                  alt={product.name}
                />
                {product.discountpercentage > 0 && (
                  <span className="pc-badge">{product.discountpercentage}% OFF</span>
                )}
                <div className="pc-overlay">
                  <span className="pc-quick-btn">Quick View</span>
                </div>
                <button
                  className={`pc-wish ${wishlistItems.some(i => i._id === product._id) ? 'pc-wish--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product); }}
                >
                  <i className={`fa-${wishlistItems.some(i => i._id === product._id) ? 'solid' : 'regular'} fa-heart`}></i>
                </button>
              </div>
              <div className="pc-body">
                <span className="pc-cat">Conditioner</span>
                <p className="pc-name">{product.name}</p>
                <p className="pc-desc">{product.description}</p>
                <div className="pc-rating">
                  <Rating value={product.rating || 0} size="small" readOnly />
                  <span>({product.rating || 0})</span>
                </div>
                <div className="pc-price-row">
                  <span className="pc-price">₹{product.discountprice}</span>
                  <span className="pc-mrp"><del>₹{product.price}</del></span>
                </div>
                <div className="pc-stock">
                  <span className={`pc-dot ${product.stock > 0 ? '' : 'pc-dot--out'}`}></span>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
                <button className="pc-btn" onClick={() => navigate(`/productdetail/${product._id}`)}>
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-5 text-muted">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Conditioner;
