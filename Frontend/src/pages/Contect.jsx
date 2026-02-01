import React, { useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import './Contect.css';

const Contect = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <-- new state for error messages
  const [form , setForm] = useState({
    firstname:"", 
    lastname:"", 
    email:"", 
    contactnumber:"",
    address:""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear previous error

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact/submit`, form);

      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      });

      // reset form
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        contactnumber: "",
        address: "",
      });

      navigate("/");

    } catch (err) {
      // If backend sends a message in err.response.data.message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-aos="zoom-in" className='contact-form'>
      <div className="row p-5">
        <div className="col-12 col-md-5 contact-first text-center">
          <div className='p-5'>
            <h3 className='mb-3'>Let's Get In Touch</h3>
            <div className='mb-3'><i className="fa-solid fa-phone"></i> 91+ 8878778689</div>
            <div className='mb-3'><i className="fa-solid fa-location-dot"></i> main road, Ahmedabad</div>
            <div className='mb-3'><i className="fa-regular fa-envelope"></i> Shinyy12@gmail.com</div>
          </div>
        </div>

        <div className="col-12 col-md-7 p-5">
          <form onSubmit={handleSubmit} className='contact-form'>
            <div className="mb-3">
              <label className="form-label"><i className="fa-regular fa-user"></i> First Name</label>
              <input type="text" name="firstname" placeholder='First Name' value={form.firstname} onChange={handleChange} className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label"><i className="fa-regular fa-user"></i> Last Name</label>
              <input type="text" name="lastname" value={form.lastname} onChange={handleChange} placeholder='Last Name' className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label"><i className="fa-solid fa-envelope"></i> Email</label>
              <input type="email" name="email" placeholder='Enter your email' onChange={handleChange} value={form.email} className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label"><i className="fa-solid fa-phone-volume"></i> Contact Number</label>
              <input type="number" name="contactnumber" placeholder='+91' onChange={handleChange} value={form.contactnumber} className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label"><i className="fa-solid fa-location-dot"></i> Address</label>
              <textarea name="address" placeholder="Enter your full address here..." value={form.address} onChange={handleChange} className='w-100' required></textarea>
            </div>

            {/* Display error message above button */}
            {error && <div className="mb-3 text-danger">{error}</div>}

            <div>
              <button type='submit' className='w-100 submit-btn' disabled={loading}>
                {loading ? (
                  <span><i className="fa fa-spinner fa-spin"></i> Submitting...</span>
                ) : (
                  "Submit Information"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contect;
