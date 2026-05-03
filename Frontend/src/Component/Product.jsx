import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import Rating from "@mui/material/Rating";
import axios from "axios";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

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
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/all?status=active`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="multi-product">
      {/* Header */}
      <div className="mp-header">
        <span className="mp-eyebrow">✦ Fresh Picks</span>
        <h2 className="mp-title">Our <span>Products</span></h2>
        <p className="mp-sub">Handpicked hair care for every type and concern</p>
      </div>

      {/* Toolbar */}
      <div className="mp-toolbar">
        <span className="mp-more-link" onClick={() => navigate('/allproducts')}>
          View All Products <i className="fa-solid fa-arrow-right" />
        </span>
        <div className="mp-nav-btns">
          <button className="mp-nav-btn custom-prev">
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button className="mp-nav-btn custom-next">
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Grid, Navigation]}
        slidesPerView={5}
        grid={{ rows: 1 }}
        spaceBetween={18}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        breakpoints={{
          320:  { slidesPerView: 1 },
          500:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="product-card">
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
                />
                <div className="pc-overlay">
                  <span className="pc-quick-btn">View Details →</span>
                </div>
              </div>

              {/* Body */}
              <div className="pc-body">
                <span className="pc-cat text-capitalize">{product.category}</span>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Product;
