import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Addproduct.css";

const Addproduct = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // edit data

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountprice: "",
    discountpercentage: "",
    rating: "",
    stock: "",
    category: "shampoo",
    image: null,
  });

  useEffect(() => {
    if (state) {
      setForm({ ...state, image: null });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });

    try {
      if (state) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/update/${state._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        Swal.fire( "Product updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products/add`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        Swal.fire( "Product added successfully");
      }
      navigate("/admin/product");
    } catch {
      Swal.fire( "Something went wrong", "error");
    }
  };

  return (
    <div className="add-product-container">
      <div className="admin-header mb-4">
        <h2>{state ? "Edit Product" : "Add New Product"}</h2>
      </div>
      
      <div className="form-card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="row g-3">
            <div className="col-12 col-md-6 form-group">
              <label>Product Name</label>
              <input className="form-control" name="name" placeholder="Enter product name" value={form.name} onChange={handleChange} required />
            </div>
            
            <div className="col-12 col-md-6 form-group">
              <label>Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                <option value="shampoo">Shampoo</option>
                <option value="conditioner">Conditioner</option>
                <option value="serum">Serum</option>
                <option value="oil">Oil</option>
              </select>
            </div>

            <div className="col-12 form-group">
              <label>Description</label>
              <textarea className="form-control" name="description" placeholder="Product description..." value={form.description} onChange={handleChange} rows="4" required />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Price (₹)</label>
              <input className="form-control" name="price" type="number" min="0" placeholder="0.00" value={form.price} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Discount Price (₹)</label>
              <input className="form-control" name="discountprice" min="0" type="number" placeholder="0.00" value={form.discountprice} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Discount %</label>
              <input className="form-control" name="discountpercentage" min="0" type="number" placeholder="0%" value={form.discountpercentage} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Stock Quantity</label>
              <input
                className="form-control"
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Rating</label>
              <input className="form-control" name="rating" type="number" placeholder="0.0" value={form.rating} onChange={handleChange} />
            </div>

            <div className="col-12 col-md-4 form-group">
              <label>Product Image</label>
              <input className="form-control" type="file" name="image" onChange={handleChange} />
            </div>
            
            <div className="col-12 mt-4">
              <button type="submit" className="submit-btn">
                {state ? "Update Product" : "Publish Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
