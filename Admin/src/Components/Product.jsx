import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  const navigate = useNavigate();

// function for soting filtered products
const getFilteredProducts = () => {
  let filtered = [...products];

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


const StatusToggle = ({ status, onChange }) => {
  const getNextStatus = () => {
    if (status === "active") return "inactive";
    if (status === "inactive") return "outofstock";
    return "active";
  };

  const handleToggle = () => {
    onChange(getNextStatus());
  };

  const getColor = () => {
    if (status === "active") return "#4CAF50"; 
    if (status === "inactive") return "#f44336"; 
    if (status === "outofstock") return "#ff9800";
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Switch
        onChange={handleToggle}
        checked={status === "active"}
        onColor="#4CAF50"
        offColor={getColor()}
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={40}
      />
      <span style={{ marginLeft: "10px" }}>{status}</span>
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
                  <span className={`badge ${
                    selectedProduct.status === "active"
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
          <div className="table-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="product-filter-select from-select form-select-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="outofstock">Out of Stock</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="product-filter-select"
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
                className="product-filter-select"
              >
                <option value="">Price: All</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>

              <select
                value={nameSort}
                onChange={(e) => setNameSort(e.target.value)}
                className="product-filter-select"
              >
                <option value="">Name: All</option>
                <option value="a-z">A → Z</option>
                <option value="z-a">Z → A</option>
              </select>
            </div>

        </div>
        <div>
           <button
          className="add-btn"
          onClick={() => navigate("/admin/addproduct")}
        >
          + Add Product
        </button>
        </div>
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
            {getFilteredProducts().map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

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
                  <button data-toggle="tooltip" data-placement="top" title="edit" className="edit" onClick={() => handleEdit(item)}>
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                  <button
                    className="edit"
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

        {products.length === 0 && (
          <p className="empty-text">No products available</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Product;
