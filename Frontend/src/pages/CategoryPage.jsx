import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useWishlist } from "../Context/WishlistContext";
import BackButton from '../Component/BackButton';
import "../Component/Product.css";
import "./CategoryPage.css";

const CATEGORY_META = {
  oil:         { icon: "🌿", label: "Hair Oil",         desc: "Nourish your roots with premium natural oils" },
  shampoo:     { icon: "🧴", label: "Hair Shampoo",     desc: "Gentle cleansing for every hair type" },
  conditioner: { icon: "💧", label: "Hair Conditioner",  desc: "Silky smooth hydration for beautiful locks" },
  serum:       { icon: "✨", label: "Hair Serum",        desc: "Advanced repair and shine therapy" },
};

export default function CategoryPage({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const meta = CATEGORY_META[category] || { icon: "📦", label: category, desc: "" };

  const isWished = (id) => wishlistItems.some(i => i._id === id);
  const toggleWish = (e, product) => {
    e.stopPropagation();
    isWished(product._id) ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  const discount = (p) =>
    p.discountpercentage ||
    (p.price && p.discountprice
      ? Math.round((1 - Number(p.discountprice) / Number(p.price)) * 100)
      : 0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/category/${category}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="cp-page">
      <div style={{padding: "20px 20px 0", maxWidth: "1200px", margin: "0 auto"}}>
        <BackButton />
      </div>
      {/* ── Hero Header ── */}
      <div className="cp-hero">
        <div className="cp-hero-blob cp-hero-blob-1" />
        <div className="cp-hero-blob cp-hero-blob-2" />
        <div className="cp-hero-content">
          <div className="cp-hero-icon">{meta.icon}</div>
          <span className="cp-hero-eyebrow">✦ Category</span>
          <h1 className="cp-hero-title">{meta.label}</h1>
          <p className="cp-hero-sub">{meta.desc}</p>
        </div>
        {/* Breadcrumb */}
        <div className="cp-breadcrumb">
          <span className="cp-bc-link" onClick={() => navigate("/")}>Home</span>
          <i className="fa-solid fa-chevron-right cp-bc-sep" />
          <span className="cp-bc-link" onClick={() => navigate("/allproducts")}>Products</span>
          <i className="fa-solid fa-chevron-right cp-bc-sep" />
          <span className="cp-bc-active">{meta.label}</span>
        </div>
      </div>

      {/* ── Product Count Bar ── */}
      <div className="cp-count-bar">
        <span className="cp-count">
          <strong>{products.length}</strong> product{products.length !== 1 ? "s" : ""} found
        </span>
        <button className="cp-all-btn" onClick={() => navigate("/allproducts")}>
          View All Products <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      {/* ── Loading Skeletons ── */}
      {loading ? (
        <div className="cp-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="cp-skeleton" />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ── Empty State ── */
        <div className="cp-empty">
          <div className="cp-empty-icon">{meta.icon}</div>
          <h3>No {meta.label} Products Yet</h3>
          <p>We're working on adding new products. Check back soon!</p>
          <button className="cp-empty-btn" onClick={() => navigate("/allproducts")}>
            Browse All Products <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      ) : (
        /* ── Product Grid ── */
        <div className="cp-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {/* Discount badge */}
              {discount(product) > 0 && (
                <span className="pc-badge">−{discount(product)}%</span>
              )}

              {/* Wishlist */}
              <button
                className={`pc-wish ${isWished(product._id) ? "pc-wish--active" : ""}`}
                onClick={(e) => toggleWish(e, product)}
              >
                <i className={`fa-${isWished(product._id) ? "solid" : "regular"} fa-heart`} />
              </button>

              {/* Image */}
              <div
                className="pc-img-wrap"
                onClick={() => navigate(`/productdetail/${product._id}`)}
              >
                <img
                  src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                  alt={product.name}
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
                <div className="pc-overlay">
                  <span className="pc-quick-btn">View Details →</span>
                </div>
              </div>

              {/* Body */}
              <div className="pc-body">
                <span className="pc-cat text-capitalize">{product.category || category}</span>
                <h3 className="pc-name">{product.name}</h3>
                <p className="pc-desc">{product.description}</p>

                <div className="pc-rating">
                  <Rating value={product.rating || 0} readOnly size="small" precision={0.5} />
                  <span>({product.rating || 0})</span>
                </div>

                <div className="pc-price-row">
                  <span className="pc-price">₹{product.discountprice}</span>
                  {product.price && <del className="pc-mrp">₹{product.price}</del>}
                </div>

                <div className="pc-stock">
                  <span className={`pc-dot ${Number(product.stock) > 0 ? "" : "pc-dot--out"}`} />
                  {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                </div>

                <button
                  className="pc-btn"
                  onClick={() => navigate(`/productdetail/${product._id}`)}
                >
                  View Details <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
