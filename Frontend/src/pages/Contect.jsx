import React, { useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import './Contect.css';

const Contect = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contactnumber: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact/submit`, form);
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setForm({ firstname: "", lastname: "", email: "", contactnumber: "", address: "" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">

        {/* ── Left: Info Panel ── */}
        <div className="contact-info">
          <div>
            <div className="contact-info-eyebrow">Get in Touch</div>
            <h2 className="contact-info-title">
              Let's Talk <span>Hair Care</span>
            </h2>
            <p className="contact-info-sub">
              Have a question, feedback or need help choosing the right product? We'd love to hear from you.
            </p>
          </div>

          <div className="contact-detail-list">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="contact-detail-text">
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-value">+91 88787 78689</span>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="contact-detail-text">
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-value">shinyy12@gmail.com</span>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="contact-detail-text">
                <span className="contact-detail-label">Address</span>
                <span className="contact-detail-value">Main Road, Ahmedabad</span>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div className="contact-detail-text">
                <span className="contact-detail-label">Working Hours</span>
                <span className="contact-detail-value">Mon – Sat, 9am – 6pm</span>
              </div>
            </div>
          </div>

          <div className="contact-socials">
            <a className="contact-social-btn" href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a className="contact-social-btn" href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a className="contact-social-btn" href="#" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="contact-form-panel">
          <h3 className="contact-form-title">Send us a Message</h3>
          <p className="contact-form-sub">Fill in the details below and we'll get back to you shortly.</p>

          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">
                  <i className="fa-regular fa-user"></i> First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First name"
                  value={form.firstname}
                  onChange={handleChange}
                  className="contact-input"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">
                  <i className="fa-regular fa-user"></i> Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last name"
                  value={form.lastname}
                  onChange={handleChange}
                  className="contact-input"
                  required
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">
                  <i className="fa-solid fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="contact-input"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">
                  <i className="fa-solid fa-phone"></i> Contact Number
                </label>
                <input
                  type="number"
                  name="contactnumber"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.contactnumber}
                  onChange={handleChange}
                  className="contact-input"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label">
                <i className="fa-solid fa-location-dot"></i> Address
              </label>
              <textarea
                name="address"
                placeholder="Enter your full address here..."
                value={form.address}
                onChange={handleChange}
                className="contact-textarea"
                required
              />
            </div>

            {error && <div className="contact-error"><i className="fa-solid fa-circle-exclamation me-2"></i>{error}</div>}

            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? (
                <><i className="fa fa-spinner fa-spin"></i> Submitting...</>
              ) : (
                <><i className="fa-solid fa-paper-plane"></i> Send Message</>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contect;
