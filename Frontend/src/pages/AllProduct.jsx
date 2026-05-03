import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useWishlist } from "../Context/WishlistContext";
import "./AllProduct.css";

const PRICE_RANGES = [
  { label: "Under ₹200",   min: 0,    max: 200  },
  { label: "₹201 – ₹500",  min: 201,  max: 500  },
  { label: "₹501 – ₹1000", min: 501,  max: 1000 },
  { label: "Above ₹1000",  min: 1001, max: Infinity },
];

const CATEGORY_ICONS = {
  shampoo:     "🧴",
  conditioner: "💧",
  serum:       "✨",
  oil:         "🌿",
  default:     "📦",
};

const SORT_OPTIONS = [
  { value: "Popularity",      label: "⭐ Popularity"       },
  { value: "Name A-Z",        label: "🔤 Name (A → Z)"     },
  { value: "Name Z-A",        label: "🔤 Name (Z → A)"     },
  { value: "Price Low-High",  label: "💰 Price: Low → High" },
  { value: "Price High-Low",  label: "💰 Price: High → Low" },
];

export default function AllProduct() {
  const [products,         setProducts]         = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCats,     setSelectedCats]     = useState([]);
  const [selectedPrices,   setSelectedPrices]   = useState([]);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [sortOption,       setSortOption]       = useState("Popularity");
  const [viewMode,         setViewMode]         = useState("grid");
  const [loading,          setLoading]          = useState(true);
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [hoveredId,        setHoveredId]        = useState(null);

  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const searchRef = useRef(null);

  const isWished = (id) => wishlistItems.some(i => i._id === id);
  const toggleWish = (product) => {
    isWished(product._id) ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/all?status=active`);
        const data = res.data;
        setProducts(data);
        const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        setCategories(cats);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchQuery.trim())
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCats.length)
      result = result.filter(p => selectedCats.includes(p.category));
    if (selectedPrices.length)
      result = result.filter(p =>
        selectedPrices.some(idx => {
          const r = PRICE_RANGES[idx];
          const price = Number(p.discountprice || p.price);
          return price >= r.min && price <= r.max;
        })
      );
    switch (sortOption) {
      case "Popularity":     result.sort((a,b) => (b.rating||0)-(a.rating||0)); break;
      case "Name A-Z":       result.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "Name Z-A":       result.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "Price Low-High": result.sort((a,b) => Number(a.discountprice||0)-Number(b.discountprice||0)); break;
      case "Price High-Low": result.sort((a,b) => Number(b.discountprice||0)-Number(a.discountprice||0)); break;
      default: break;
    }
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCats, selectedPrices, sortOption]);

  const toggleCat   = (c) => setSelectedCats(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);
  const togglePrice = (i) => setSelectedPrices(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);
  const clearAll    = () => { setSelectedCats([]); setSelectedPrices([]); setSearchQuery(""); };

  const activeFilters = selectedCats.length + selectedPrices.length;

  const discount = (p) => p.discountpercentage || (p.price && p.discountprice
    ? Math.round((1 - Number(p.discountprice)/Number(p.price)) * 100) : 0);

  return (
    <div className="ap-root">

      {/* ── Hero Banner ── */}
      <div className="ap-hero">
        <div className="ap-hero-blob ap-hero-blob-1" />
        <div className="ap-hero-blob ap-hero-blob-2" />
        <div className="ap-hero-content">
          <span className="ap-hero-eyebrow">✦ Explore Our Collection</span>
          <h1 className="ap-hero-title">All Products</h1>
          <p className="ap-hero-sub">
            {products.length} premium hair care products — filtered just for you
          </p>
          {/* Search bar inside hero */}
          <div className="ap-hero-search" ref={searchRef}>
            <i className="fa-solid fa-magnifying-glass ap-search-icon" />
            <input
              className="ap-search-input"
              placeholder="Search shampoos, serums, oils…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="ap-search-clear" onClick={() => setSearchQuery("")}>
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="ap-breadcrumb">
          <span onClick={() => navigate("/")} className="ap-bc-link">Home</span>
          <i className="fa-solid fa-chevron-right ap-bc-sep" />
          <span className="ap-bc-active">All Products</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ap-body">

        {/* Mobile Filter Toggle */}
        <button className="ap-mob-filter-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="fa-solid fa-sliders" />
          Filters {activeFilters > 0 && <span className="ap-filter-badge">{activeFilters}</span>}
        </button>

        {/* ── Sidebar ── */}
        <aside className={`ap-sidebar ${sidebarOpen ? "ap-sidebar--open" : ""}`}>
          <div className="ap-sidebar-header">
            <span className="ap-sidebar-title">
              <i className="fa-solid fa-sliders" /> Filters
            </span>
            {activeFilters > 0 && (
              <button className="ap-clear-btn" onClick={clearAll}>Clear all</button>
            )}
          </div>

          {/* Category */}
          <div className="ap-filter-section">
            <p className="ap-filter-label">Category</p>
            <div className="ap-cat-pills">
              {categories.map(cat => {
                const icon = CATEGORY_ICONS[cat.toLowerCase()] || CATEGORY_ICONS.default;
                return (
                  <button
                    key={cat}
                    className={`ap-cat-pill ${selectedCats.includes(cat) ? "ap-cat-pill--active" : ""}`}
                    onClick={() => toggleCat(cat)}
                  >
                    <span>{icon}</span>
                    <span className="text-capitalize">{cat}</span>
                    {selectedCats.includes(cat) && <i className="fa-solid fa-check ap-pill-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="ap-filter-section">
            <p className="ap-filter-label">Price Range</p>
            <div className="ap-price-options">
              {PRICE_RANGES.map((r, i) => (
                <label key={i} className={`ap-price-chip ${selectedPrices.includes(i) ? "ap-price-chip--active" : ""}`}>
                  <input
                    type="checkbox"
                    hidden
                    checked={selectedPrices.includes(i)}
                    onChange={() => togglePrice(i)}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          {/* Stock indicator */}
          <div className="ap-sidebar-tip">
            <i className="fa-solid fa-circle-info" />
            <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ap-main">

          {/* Toolbar */}
          <div className="ap-toolbar">
            <div className="ap-toolbar-left">
              <span className="ap-result-count">
                <strong>{filteredProducts.length}</strong> Products
              </span>
              {/* Active filter chips */}
              {selectedCats.map(c => (
                <span key={c} className="ap-chip" onClick={() => toggleCat(c)}>
                  {c} <i className="fa-solid fa-xmark" />
                </span>
              ))}
              {selectedPrices.map(i => (
                <span key={i} className="ap-chip" onClick={() => togglePrice(i)}>
                  {PRICE_RANGES[i].label} <i className="fa-solid fa-xmark" />
                </span>
              ))}
            </div>
            <div className="ap-toolbar-right">
              <select
                className="ap-sort-select"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="ap-view-btns">
                <button
                  className={`ap-view-btn ${viewMode==="grid" ? "ap-view-btn--active":""}`}
                  onClick={() => setViewMode("grid")} title="Grid"
                >
                  <i className="fa-solid fa-border-all" />
                </button>
                <button
                  className={`ap-view-btn ${viewMode==="list" ? "ap-view-btn--active":""}`}
                  onClick={() => setViewMode("list")} title="List"
                >
                  <i className="fa-solid fa-list" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="ap-loading">
              {[...Array(6)].map((_,i) => <div key={i} className="ap-skeleton" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="ap-empty-btn" onClick={clearAll}>Reset Filters</button>
            </div>
          ) : viewMode === "grid" ? (

            /* ── GRID ── */
            <div className="ap-grid">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product._id}
                  className={`ap-card ${hoveredId===product._id ? "ap-card--hovered":""}`}
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  {/* Discount badge */}
                  {discount(product) > 0 && (
                    <span className="ap-card-badge">−{discount(product)}%</span>
                  )}

                  {/* Wishlist */}
                  <button
                    className={`ap-card-wish ${isWished(product._id) ? "ap-card-wish--active":""}`}
                    onClick={(e) => { e.stopPropagation(); toggleWish(product); }}
                  >
                    <i className={`fa-${isWished(product._id)?"solid":"regular"} fa-heart`} />
                  </button>

                  {/* Image */}
                  <div className="ap-card-img-wrap" onClick={() => navigate(`/productdetail/${product._id}`)}>
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                      alt={product.name}
                      className="ap-card-img"
                    />
                    <div className="ap-card-img-overlay">
                      <span className="ap-quick-view">View Details →</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="ap-card-body">
                    <span className="ap-card-cat text-capitalize">{product.category}</span>
                    <h3 className="ap-card-name">{product.name}</h3>
                    <p className="ap-card-desc">{product.description}</p>

                    <div className="ap-card-rating">
                      <Rating value={product.rating || 0} readOnly size="small" precision={0.5} />
                      <span className="ap-card-rating-num">({product.rating || 0})</span>
                    </div>

                    <div className="ap-card-pricing">
                      <span className="ap-card-price">₹{product.discountprice}</span>
                      {product.price && <del className="ap-card-mrp">₹{product.price}</del>}
                    </div>

                    <div className="ap-card-stock">
                      <span className={`ap-stock-dot ${Number(product.stock)>0?"ap-stock-dot--in":"ap-stock-dot--out"}`} />
                      {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </div>

                    <button
                      className="ap-card-btn"
                      onClick={() => navigate(`/productdetail/${product._id}`)}
                    >
                      View Details <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* ── LIST ── */
            <div className="ap-list">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product._id}
                  className="ap-list-card"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <div className="ap-list-img-wrap" onClick={() => navigate(`/productdetail/${product._id}`)}>
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                      alt={product.name}
                      className="ap-list-img"
                    />
                    {discount(product) > 0 && (
                      <span className="ap-card-badge">−{discount(product)}%</span>
                    )}
                  </div>
                  <div className="ap-list-body">
                    <div className="ap-list-top">
                      <span className="ap-card-cat text-capitalize">{product.category}</span>
                      <button
                        className={`ap-card-wish ${isWished(product._id)?"ap-card-wish--active":""}`}
                        style={{position:"static"}}
                        onClick={() => toggleWish(product)}
                      >
                        <i className={`fa-${isWished(product._id)?"solid":"regular"} fa-heart`} />
                      </button>
                    </div>
                    <h3 className="ap-list-name">{product.name}</h3>
                    <p className="ap-list-desc">{product.description}</p>
                    <div className="ap-card-rating">
                      <Rating value={product.rating||0} readOnly size="small" precision={0.5} />
                      <span className="ap-card-rating-num">({product.rating||0})</span>
                    </div>
                    <div className="ap-list-footer">
                      <div className="ap-card-pricing">
                        <span className="ap-card-price">₹{product.discountprice}</span>
                        {product.price && <del className="ap-card-mrp">₹{product.price}</del>}
                        {discount(product) > 0 && (
                          <span className="ap-list-discount">{discount(product)}% OFF</span>
                        )}
                      </div>
                      <div className="ap-card-stock">
                        <span className={`ap-stock-dot ${Number(product.stock)>0?"ap-stock-dot--in":"ap-stock-dot--out"}`} />
                        {Number(product.stock)>0 ? `${product.stock} in stock`:"Out of stock"}
                      </div>
                      <button
                        className="ap-card-btn"
                        onClick={() => navigate(`/productdetail/${product._id}`)}
                      >
                        View Details <i className="fa-solid fa-arrow-right" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
