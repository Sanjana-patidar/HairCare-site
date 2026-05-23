import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import BackButton from '../Component/BackButton';
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to cart! 🛒");
  };

  const discount = (p) =>
    p.discountpercentage ||
    (p.price && p.discountprice
      ? Math.round((1 - Number(p.discountprice) / Number(p.price)) * 100)
      : 0);

  /* ── Empty State ── */
  if (wishlistItems.length === 0) {
    return (
      <div className="wl-page">
        <BackButton />
        <div className="wl-empty">
          <div className="wl-empty-icon">
            <i className="fa-regular fa-heart" />
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>Explore our products and save your favourites here!</p>
          <Link to="/allproducts" className="wl-empty-btn">
            Browse Products <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <BackButton />
      {/* ── Header ── */}
      <div className="wl-header">
        <div className="wl-header-left">
          <div className="wl-icon-wrap">
            <i className="fa-solid fa-heart" />
          </div>
          <div>
            <h1 className="wl-title">My Wishlist</h1>
            <span className="wl-count">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
            </span>
          </div>
        </div>
        <button className="wl-shop-btn" onClick={() => navigate("/allproducts")}>
          Shop More <i className="fa-solid fa-bag-shopping" />
        </button>
      </div>

      {/* ── Product Grid ── */}
      <div className="wl-grid">
        {wishlistItems.map((product) => {
          const disc = discount(product);

          return (
            <div className="wl-card" key={product._id}>
              {/* Discount badge */}
              {disc > 0 && (
                <span className="wl-badge">−{disc}%</span>
              )}

              {/* Remove button */}
              <button
                className="wl-remove-btn"
                onClick={() => removeFromWishlist(product._id)}
                title="Remove from Wishlist"
              >
                <i className="fa-solid fa-xmark" />
              </button>

              {/* Image */}
              <div
                className="wl-img-wrap"
                onClick={() => navigate(`/productdetail/${product._id}`)}
              >
                <img
                  src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                  alt={product.name}
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
                <div className="wl-overlay">
                  <button className="wl-quick-btn">View Details →</button>
                </div>
              </div>

              {/* Body */}
              <div className="wl-body">
                <span className="wl-cat text-capitalize">
                  {product.category || "Hair Care"}
                </span>
                <h3 className="wl-name">{product.name}</h3>

                <div className="wl-price-row">
                  <span className="wl-price">₹{product.discountprice}</span>
                  {product.price && (
                    <del className="wl-mrp">₹{product.price}</del>
                  )}
                </div>

                {/* Actions */}
                <div className="wl-actions">
                  <button
                    className="wl-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fa-solid fa-cart-shopping" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
