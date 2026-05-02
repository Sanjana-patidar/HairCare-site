import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useWishlist } from "../Context/WishlistContext";
import "../Component/Product.css";
import "./AllProduct.css";

const PRICE_RANGES = [
  { label: "Rs 100 to 200", min: 100, max: 200 },
  { label: "Rs 201 to 500", min: 201, max: 500 },
  { label: "Rs 501 to 1000", min: 501, max: 1000 },
  { label: "More than Rs 1000", min: 1001, max: Infinity }
];

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Popularity");
  const [viewMode, setViewMode] = useState("grid");

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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/products/all?status=active`);
        const productsData = productRes.data;
        setProducts(productsData);

        // Extract unique categories directly from the products list
        const uniqueCategories = Array.from(new Set(productsData.map(p => p.category).filter(Boolean)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtering and Sorting logic
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim() !== "") {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category filter (using brand/category name)
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    if (selectedPrices.length > 0) {
      result = result.filter(p => {
        return selectedPrices.some(index => {
          const range = PRICE_RANGES[index];
          const price = Number(p.discountprice || p.price);
          return price >= range.min && price <= range.max;
        });
      });
    }

    // Sort
    switch (sortOption) {
      case "Popularity":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "Name A-Z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name Z-A":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price Low-High":
        result.sort((a, b) => Number(a.discountprice || 0) - Number(b.discountprice || 0));
        break;
      case "Price High-Low":
        result.sort((a, b) => Number(b.discountprice || 0) - Number(a.discountprice || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories, selectedPrices, sortOption]);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handlePriceToggle = (index) => {
    setSelectedPrices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="container-fluid py-4 px-4 all-products-page">
      <div className="row mb-5">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 px-2" style={{ fontSize: "15px" }}>
              <li className="breadcrumb-item text-muted" style={{ cursor: "pointer", transition: "color 0.2s" }} onClick={() => navigate("/")} onMouseOver={(e) => e.target.style.color = "rgb(192, 223, 54)"} onMouseOut={(e) => e.target.style.color = ""}>Home</li>
              <li className="breadcrumb-item active text-dark" aria-current="page">All Products</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="filter-sidebar">
            <h5 className="mb-3">Categories</h5>
            <div className="mb-4 d-flex flex-column gap-2">
              {categories.map((catName, index) => (
                <div className="form-check custom-checkbox" key={`cat-${index}`}>
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    id={`cat-${index}`}
                    onChange={() => handleCategoryToggle(catName)}
                    checked={selectedCategories.includes(catName)}
                  />
                  <label className="form-check-label ms-1 text-capitalize" htmlFor={`cat-${index}`}>
                    {catName}
                  </label>
                </div>
              ))}
            </div>

            <h5 className="mb-3 fw-bold mt-4">Price</h5>
            <div className="d-flex flex-column gap-2">
              {PRICE_RANGES.map((range, index) => (
                <div className="form-check custom-checkbox" key={index}>
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    id={`price-${index}`}
                    onChange={() => handlePriceToggle(index)}
                    checked={selectedPrices.includes(index)}
                  />
                  <label className="form-check-label ms-1 text-muted" htmlFor={`price-${index}`}>
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 pb-2 top-bar-filters gap-3">
            <h2 className="m-0 page-title fw-bold" style={{ color: "#333" }}>Products</h2>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between justify-content-lg-end gap-3 right-controls w-100" style={{ maxWidth: "100%" }}>

              <div className="input-group search-group" style={{ maxWidth: "400px", flex: 1 }}>
                <input
                  type="text"
                  className="form-control shadow-none border-0 bg-transparent"
                  placeholder="search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="input-group-text bg-transparent border-0">
                  <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
              </div>

              <div className="d-flex align-items-center align-sort">
                <span className="me-2 text-nowrap sort-label">Sort By:</span>
                <select
                  className="form-select shadow-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Name A-Z">Name (A - Z)</option>
                  <option value="Name Z-A">Name (Z - A)</option>
                  <option value="Price Low-High">Price (Low - High)</option>
                  <option value="Price High-Low">Price (High - Low)</option>
                </select>
                <div className="d-flex ms-3 gap-2 align-items-center">
                  <button 
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <i className="fa-solid fa-border-all"></i>
                  </button>
                  <button 
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <i className="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                viewMode === "grid" ? (
                  <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" key={product._id}>
                    <div className="product-card text-center w-100 mx-0 mt-0">
                      <div>
                        <img
                          className="w-75"
                          src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                          alt={product.name}
                          style={{ objectFit: "contain", height: "160px" }}
                        />
                        <h6 className="mt-3 fw-bold" style={{ color: "#333" }}>{product.name}</h6>
                        <p className="description text-truncate" style={{ color: "rgb(192, 223, 54)", fontSize: "0.9rem" }}>{product.description}</p>
                        <p className="d-flex align-items-center justify-content-center gap-2 mb-2">
                          <span className="fw-bold fs-6">₹{product.discountprice}</span>
                          <del className="text-secondary small">₹{product.price}</del>
                          <span className="small font-weight-bold">{product.discountpercentage}%</span>
                        </p>
                        <Box sx={{ "& > legend": { mt: 2 } }}>
                          <Rating value={product.rating} readOnly size="small" />
                        </Box>
                        <button
                          onClick={() => navigate(`/productdetail/${product._id}`)}
                          className="w-100 add-to-cart-btn mt-3 py-2 fw-medium border-0 rounded"
                        >
                          Product Detail <i className="fa-solid fa-arrow-right ms-1"></i>
                        </button>
                      </div>
                      <div className="like-btn">
                        {wishlistItems.some(item => item._id === product._id) ? (
                          <i className="fa-solid fa-heart text-danger hvr-grow" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                        ) : (
                          <i className="fa-regular fa-heart hvr-grow" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                        )}
                        <p style={{ color: "rgb(192, 223, 54)", margin: 0 }} >stock:{product.stock}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12" key={product._id}>
                    <div className="product-card list-view-card d-flex flex-column flex-md-row align-items-center gap-4 p-3 w-100 mx-0 mt-0 position-relative" style={{ textAlign: "left" }}>
                      <div className="list-img-container text-center" style={{ width: "200px", flexShrink: 0 }}>
                        <img
                          className="w-100"
                          src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                          alt={product.name}
                          style={{ objectFit: "contain", height: "180px" }}
                        />
                      </div>
                      <div className="list-content-container flex-grow-1 w-100">
                        <div className="d-flex justify-content-between align-items-start w-100 mb-2">
                           <h5 className="fw-bold m-0" style={{ color: "#333" }}>{product.name}</h5>
                           <div className="like-btn position-static">
                             {wishlistItems.some(item => item._id === product._id) ? (
                               <i className="fa-solid fa-heart text-danger hvr-grow fs-5" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                             ) : (
                               <i className="fa-regular fa-heart hvr-grow fs-5" onClick={() => handleWishlistToggle(product)} style={{cursor: "pointer"}}></i>
                             )}
                           </div>
                        </div>
                        <p className="description mb-3" style={{ color: "rgb(192, 223, 54)", fontSize: "0.95rem", maxWidth: "800px" }}>{product.description}</p>
                        
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span className="fw-bold fs-4" style={{ color: "#333" }}>₹{product.discountprice}</span>
                          <del className="text-secondary">₹{product.price}</del>
                          <span className="badge bg-success px-2 py-1">{product.discountpercentage}% OFF</span>
                        </div>
                        
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center w-100 gap-3">
                           <div className="d-flex align-items-center gap-3">
                             <Box sx={{ "& > legend": { mt: 2 } }}>
                               <Rating value={product.rating} readOnly size="small" />
                             </Box>
                             <span className="fw-medium" style={{ color: "rgb(192, 223, 54)" }}>Stock: {product.stock}</span>
                           </div>
                           
                           <button
                             onClick={() => navigate(`/productdetail/${product._id}`)}
                             className="add-to-cart-btn py-2 px-4 fw-medium border-0 rounded w-auto m-0"
                           >
                             Product Detail <i className="fa-solid fa-arrow-right ms-1"></i>
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="fa-solid fa-box-open mb-3" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <h4 className="text-muted">No products found matching your criteria.</h4>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AllProduct;
