import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  //modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  //state for filter
  const [statusFilter, setStatusFilter] = useState(""); // "" = All
  const [categoryFilter, setCategoryFilter] = useState(""); // "" = All
  const [priceSort, setPriceSort] = useState(""); // "low-high", "high-low"
  const [nameSort, setNameSort] = useState(""); // "a-z", "z-a"
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 7;

  // function for soting filtered products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Price sort
    if (priceSort === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    // Name sort
    if (nameSort === "a-z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameSort === "z-a") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  };

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, priceSort, nameSort, searchTerm]);

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filteredProducts.slice(start, start + perPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const activeFilterCount = [statusFilter, categoryFilter, priceSort, nameSort, searchTerm].filter(Boolean).length;


  const StatusToggle = ({ status, onChange }) => {
    const getNextStatus = () => {
      if (status === "active") return "inactive";
      if (status === "inactive") return "outofstock";
      return "active";
    };

    const handleToggle = () => {
      onChange(getNextStatus());
    };

    const getIcon = () => {
      if (status === "active") return <i className="fa-solid fa-circle-check"></i>;
      if (status === "inactive") return <i className="fa-solid fa-circle-xmark"></i>;
      if (status === "outofstock") return <i className="fa-solid fa-triangle-exclamation"></i>;
    };

    return (
      <div
        className={`custom-status-badge ${status}`}
        onClick={handleToggle}
        title="Click to change status"
      >
        {getIcon()}
        {status === 'outofstock' ? 'Out of Stock' : status}
      </div>
    );
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh product list
      fetchProducts();
    } catch (error) {
      console.error(error.response || error.message);
      Swal.fire("Error", "Status update failed", "error");
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/all`);
      setProducts(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Product?",
      showCancelButton: true,
      confirmButtonColor: "#d63031",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
      Swal.fire("Deleted!", "Product removed successfully", "success");
    }
  };

  const handleEdit = (product) => {
    navigate("/admin/addproduct", { state: product });
  };

  return (

    <>
      {/* model for product detail */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
      >
        <div className=" product-modal modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedProduct?.name || "Product Details"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selectedProduct ? (
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE}/${selectedProduct.image}`}
                      className="img-fluid rounded"
                      alt={selectedProduct.name}
                    />
                  </div>

                  <div className="col-md-7">
                    <p><strong>Name:</strong> {selectedProduct.name}</p>
                    <p><strong>Category:</strong> {selectedProduct.category}</p>
                    <p><strong>Stock:</strong> {selectedProduct.stock}</p>

                    <p>
                      <strong>Price:</strong>{" "}
                      {selectedProduct.discountprice ? (
                        <>
                          <span style={{ color: "red", fontWeight: "600" }}>
                            ₹{selectedProduct.discountprice}
                          </span>{" "}
                          <span style={{ textDecoration: "line-through", color: "#999" }}>
                            ₹{selectedProduct.price}
                          </span>{" "}
                          <span className="badge bg-success">
                            {selectedProduct.discountpercentage}% OFF
                          </span>
                        </>
                      ) : (
                        <span>₹{selectedProduct.price}</span>
                      )}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${selectedProduct.status === "active"
                          ? "bg-success"
                          : selectedProduct.status === "inactive"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}>
                        {selectedProduct.status}
                      </span>
                    </p>

                    <p><strong>Description:</strong> {selectedProduct.description}</p>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* modal close */}
      <div className="admin-product-container">
        <div className="admin-header">
          <div><h2>Product Management</h2></div>
          <div>
            <button
              className="add-btn"
              onClick={() => navigate("/admin/addproduct")}
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="filter-bar-selects" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="filter-select"
              style={{ minWidth: '200px', flex: '1 1 auto' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="outofstock">Out of Stock</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="filter-select"
            >
              <option value="">Price: All</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>

            <select
              value={nameSort}
              onChange={(e) => setNameSort(e.target.value)}
              className="filter-select"
            >
              <option value="">Name: All</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button
              className="filter-clear-btn btn btn-outline-danger btn-sm"
              style={{ padding: '8px 16px', borderRadius: '8px' }}
              onClick={() => { setStatusFilter(''); setCategoryFilter(''); setPriceSort(''); setNameSort(''); setSearchTerm(''); }}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="table-card">
          <table className="product-table">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((item, index) => (
                <tr key={item._id}>
                  <td>{start + index + 1}</td>

                  <td>
                    <img
                      className="product-thumb"
                      src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`}
                      alt={item.name}
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td className="price">₹{item.price}</td>
                  <td>
                    <StatusToggle
                      status={item.status}
                      onChange={(newStatus) => updateStatus(item._id, newStatus)}
                    />
                  </td>
                  <td className="action-btns">
                    <button
                      data-toggle="tooltip" data-placement="top" title="Edit"
                      className="action-icon view"
                      style={{ color: "#3b82f6" }}
                      onClick={() => handleEdit(item)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="action-icon delete"
                      title="Delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <button
                      className="action-icon view"
                      title="View Details"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="empty-text">No products available</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pg-arrow"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                title="Previous"
              >
                <FaChevronLeft />
              </button>
              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="pg-ellipsis">...</span>
                ) : (
                  <button
                    key={p}
                    className={page === p ? 'pg-active' : ''}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className="pg-arrow"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                title="Next"
              >
                <FaChevronRight />
              </button>
              <span className="pg-info">
                {start + 1}–{Math.min(start + perPage, filteredProducts.length)} of {filteredProducts.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
