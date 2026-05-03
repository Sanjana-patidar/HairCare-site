import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiImage, FiStar, FiPackage } from "react-icons/fi";
import "./Addproduct.css";

const Addproduct = () => {
  const navigate  = useNavigate();
  const { state } = useLocation(); // edit data passed from product list

  const [form, setForm] = useState({
    name: "", description: "", price: "", discountprice: "",
    discountpercentage: "", rating: "", stock: "", category: "shampoo",
  });
  const [mainImage,    setMainImage]    = useState(null);   // File
  const [mainPreview,  setMainPreview]  = useState(null);   // URL string
  const [galleryFiles, setGalleryFiles] = useState([]);     // File[]
  const [galleryPreviews, setGalleryPreviews] = useState([]); // URL[]
  const [loading, setLoading] = useState(false);

  const mainInputRef    = useRef();
  const galleryInputRef = useRef();

  // Pre-fill on edit
  useEffect(() => {
    if (state) {
      const { image, images, __v, createdAt, updatedAt, ...rest } = state;
      setForm({ ...rest });
      if (image) setMainPreview(`${import.meta.env.VITE_API_IMAGE}/${image}`);
      if (images?.length) setGalleryPreviews(images.map(img => `${import.meta.env.VITE_API_IMAGE}/${img}`));
    }
  }, [state]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setGalleryFiles(files);
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state && !mainImage) {
      Swal.fire({ icon: "warning", title: "Please select a main product image" });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (mainImage) formData.append("image", mainImage);
    galleryFiles.forEach(f => formData.append("images", f));

    try {
      if (state) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/update/${state._id}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        Swal.fire({ icon: "success", title: "Product Updated Successfully!", timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products/add`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        Swal.fire({ icon: "success", title: "Product Published!", timer: 1500, showConfirmButton: false });
      }
      setTimeout(() => navigate("/admin/product"), 1600);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Something went wrong", text: err.response?.data?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <motion.div
        className="admin-header mb-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2>{state ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
          {state ? "Update product details and gallery images" : "Fill in details and upload product images"}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="ap-grid">
          {/* ── LEFT COLUMN ───────────────────── */}
          <div className="ap-col">

            {/* Main Image Upload */}
            <motion.div className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="ap-section-title"><FiImage /> Main Product Image</div>
              <div
                className={`ap-drop-zone ${mainPreview ? "has-image" : ""}`}
                onClick={() => mainInputRef.current.click()}
              >
                {mainPreview ? (
                  <img src={mainPreview} alt="Main" className="ap-main-preview" />
                ) : (
                  <div className="ap-drop-placeholder">
                    <FiUpload size={32} />
                    <p>Click to upload main image</p>
                    <span>PNG, JPG up to 5MB</span>
                  </div>
                )}
              </div>
              <input ref={mainInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleMainImage} />
              {mainPreview && (
                <button type="button" className="ap-clear-btn" onClick={() => { setMainImage(null); setMainPreview(null); }}>
                  <FiX /> Remove
                </button>
              )}
            </motion.div>

            {/* Gallery Images */}
            <motion.div className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="ap-section-title"><FiImage /> Gallery Images <span className="ap-badge">up to 5</span></div>
              <div
                className="ap-gallery-drop"
                onClick={() => galleryInputRef.current.click()}
              >
                <FiUpload />
                <span>Click to select gallery images</span>
                <small>These show in the product detail swiper</small>
              </div>
              <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGallery} />

              {galleryPreviews.length > 0 && (
                <div className="ap-gallery-grid">
                  <AnimatePresence>
                    {galleryPreviews.map((src, idx) => (
                      <motion.div
                        key={idx}
                        className="ap-gallery-thumb"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <img src={src} alt={`Gallery ${idx + 1}`} />
                        <button type="button" className="ap-remove-thumb" onClick={() => removeGalleryImage(idx)}>
                          <FiX />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ──────────────────── */}
          <div className="ap-col">
            {/* Basic Info */}
            <motion.div className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="ap-section-title"><FiPackage /> Product Details</div>
              <div className="ap-fields">
                <div className="ap-field-row">
                  <div className="ap-field">
                    <label>Product Name *</label>
                    <input name="name" placeholder="e.g. Amla Hair Oil" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="ap-field">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="shampoo">Shampoo</option>
                      <option value="conditioner">Conditioner</option>
                      <option value="serum">Serum</option>
                      <option value="oil">Oil</option>
                    </select>
                  </div>
                </div>

                <div className="ap-field">
                  <label>Description *</label>
                  <textarea name="description" placeholder="Describe the product..." value={form.description} onChange={handleChange} rows="4" required />
                </div>

                <div className="ap-field-row ap-field-row--3">
                  <div className="ap-field">
                    <label>MRP (₹) *</label>
                    <input name="price" type="number" min="0" placeholder="499" value={form.price} onChange={handleChange} required />
                  </div>
                  <div className="ap-field">
                    <label>Sale Price (₹) *</label>
                    <input name="discountprice" type="number" min="0" placeholder="299" value={form.discountprice} onChange={handleChange} required />
                  </div>
                  <div className="ap-field">
                    <label>Discount %</label>
                    <input name="discountpercentage" type="number" min="0" max="100" placeholder="40" value={form.discountpercentage} onChange={handleChange} />
                  </div>
                </div>

                <div className="ap-field-row">
                  <div className="ap-field">
                    <label>Stock Quantity *</label>
                    <input name="stock" type="number" min="0" placeholder="100" value={form.stock} onChange={handleChange} required />
                  </div>
                  <div className="ap-field">
                    <label><FiStar style={{ color: "#f59e0b" }} /> Rating (0–5)</label>
                    <input name="rating" type="number" min="0" max="5" step="0.1" placeholder="4.5" value={form.rating} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <button type="submit" className="ap-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="ap-spinner" /> {state ? "Updating…" : "Publishing…"}</>
                ) : (
                  state ? "✅ Update Product" : "🚀 Publish Product"
                )}
              </button>
              <button type="button" className="ap-cancel-btn" onClick={() => navigate("/admin/product")}>
                Cancel
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Addproduct;
