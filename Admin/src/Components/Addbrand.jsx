import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Addbrand.css";

const Addbrand = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, logo: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/brands/add`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      Swal.fire("Brand added successfully");
      navigate("/admin/brand");
    } catch {
      Swal.fire("Something went wrong", "error");
    }
  };

  return (
    <div className="add-brand-container">
      <div className="admin-header mb-4">
        <h2>Add New Brand</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="brand-form">
          <div className="row g-3">
            <div className="col-12 form-group">
              <label>Brand Name</label>
              <input className="form-control" name="name" placeholder="Enter brand name" value={form.name} onChange={handleChange} required />
            </div>
            
            <div className="col-12 form-group">
              <label>Description</label>
              <textarea className="form-control" name="description" placeholder="Brand description..." value={form.description} onChange={handleChange} rows="4" required />
            </div>
            
            <div className="col-12 form-group">
              <label>Brand Logo</label>
              <input className="form-control" type="file" name="logo" onChange={handleChange} required />
            </div>
            
            <div className="col-12 mt-4">
              <button type="submit" className="submit-btn">Publish Brand</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addbrand;
