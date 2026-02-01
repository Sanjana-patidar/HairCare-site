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
          "${import.meta.env.VITE_API_URL}/products/add",
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
    <div className="add-product-page">
      <form onSubmit={handleSubmit} className="product-form">
        <h3>{state ? "Edit Product" : "Add Product"}</h3>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

        <div className="row">
          <input name="price" type="number"  min="0" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="discountprice"  min="0" type="number" placeholder="Discount Price" value={form.discountprice} onChange={handleChange} />
        </div>

        <div className="row">
          <input name="discountpercentage"  min="0" type="number" placeholder="Discount %" value={form.discountpercentage} onChange={handleChange} />
          <input name="rating" type="number" placeholder="Rating" value={form.rating} onChange={handleChange} />
        </div>

        <div className="row">
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="shampoo">Shampoo</option>
          <option value="conditioner">Conditioner</option>
          <option value="serum">Serum</option>
          <option value="oil">Oil</option>
        </select>

        <input type="file" name="image" onChange={handleChange} />

        <button type="submit">
          {state ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Addproduct;
