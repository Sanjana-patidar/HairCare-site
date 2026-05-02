import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Product.css";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/brands`);
      setBrands(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load brands", "error");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Brand?",
      showCancelButton: true,
      confirmButtonColor: "#d63031",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchBrands();
        Swal.fire("Deleted!", "Brand removed successfully", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete brand", "error");
      }
    }
  };

  return (
    <div className="admin-product-container">
      <div className="admin-header">
        <div><h2>Brand Management</h2></div>
        <div>
          <button
            className="add-btn"
            onClick={() => navigate("/admin/addbrand")}
          >
            + Add Brand
          </button>
        </div>
      </div>

      <div className="table-card">
        <table className="product-table">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    className="product-thumb"
                    src={`${import.meta.env.VITE_API_IMAGE}/${item.logo}`}
                    alt={item.name}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td className="action-btns">
                  <button
                    className="action-icon delete"
                    title="Delete Brand"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {brands.length === 0 && (
          <p className="empty-text">No brands available</p>
        )}
      </div>
    </div>
  );
};

export default Brand;
