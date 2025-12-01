import React from "react";
import { useState, useRef,useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  // state for user modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // state for login/signup
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // state for user input
  const [formdata, setFormdata] = useState({
    username: "",
    email:"",
    password:"",
    confirmPassword:""
  });

// for user input value
const handleChange = (e) => {
  setFormdata({
    ...formdata,
    [e.target.name]: e.target.value,
  });
};

// useRef for input focus
const usernameRef = useRef(null);
const emailRef = useRef(null);

// useEffect 
useEffect(() => {
  if (show) {
    setTimeout(() => {
      if (isLoggedIn) {
        emailRef.current && emailRef.current.focus(); // login → email
      } else {
        usernameRef.current && usernameRef.current.focus(); // signup → username
      }
    }, 100);
  }
}, [show, isLoggedIn]);
// handleSignup
const handleSignup = async (e) =>{
  e.preventDefault();
  if(formdata.password !== formdata.confirmPassword){
       alert("password do not match");
    return;
}
   try {
    const response = await axios.post("http://localhost:5000/api/users/signup", {
      username: formdata.username,
      email: formdata.email,
      password: formdata.password,
      confirmPassword: formdata.confirmPassword,
    });

    console.log(response.data);
    alert("Signup Successful!");
    setIsLoggedIn(true); // redirect to login
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Signup Failed");
  }

}
// handleLogin function
const handleLogin = async (e) =>{
   e.preventDefault();
   try {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email: formdata.email,
      password: formdata.password,
    });
   Swal.fire({
  position: "center",
  icon: "success",
  title: "Login Successfully !",
  showConfirmButton: false,
  timer: 1500
});
    handleClose();
  } catch (error) {
    alert(error.response?.data?.message || "Login Failed");
  }
}
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light ">
        <div class="container-fluid ">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <a class="navbar-brand">
            <h3 className="logo-text text-warning"> <img src="/src/assets/img/womens-day.png" className="logo" alt="" />Shinny</h3>
          </a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav m-auto mb-2 mb-lg-0 gap-3">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Shampoo
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Conditioner
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
              <div className="search-bar d-flex align-items-center ">
                <div className="search-rel me-3">
                  <input type="search" placeholder="search" />
                  <div className="search-ab">
                    <i class="rel fa-solid fa-magnifying-glass "></i>
                  </div>
                </div>
                <div className="me-3">
                  <i class="fa-solid fa-cart-arrow-down fs-5"></i>
                </div>
                <div onClick={handleShow}>
                  <i class="fa-solid fa-user fs-5"></i>
                </div>
              </div>
            </div>
        </div>
      </nav>
      {/* usermodal  start*/}
      <div>
        <Modal show={show} onHide={handleClose} centered>
          <div className="text-end p-3" onClick={handleClose}>
            <i class="fa-solid fa-circle-xmark fs-3 cross"></i>
          </div>
          <Modal.Body>
            <div className="usermodal text-center p-3">
              {/* Heading Change */}
              {isLoggedIn ? (
                <h2>
                  Welcome! <p>Login into your Account</p>
                </h2>
              ) : (
                <h2>Create an Account</h2>
              )}

              <form onSubmit={isLoggedIn ? handleLogin : handleSignup}>
                {!isLoggedIn && (
                  <div>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} ref={usernameRef} />
                  </div>
                )}

                <div>
                  <input type="email" name="email" placeholder="Email" onChange={handleChange} ref={emailRef} />
                </div>
                <div>
                  <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                </div>
                {!isLoggedIn && (
                  <div>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>
                  </div>
                )}
                <div>
                  <button type="submit" className="btn-1">
                    {isLoggedIn ? "Login" : "Sign Up"}
                  </button>
                </div>
                <div className="switch-text">
                  {isLoggedIn ? (
                    <p>
                      Don’t have an account?
                      <span
                        className="text-primary"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        {" "}
                        Sign up here
                      </span>
                    </p>
                  ) : (
                    <p>
                      Already have an account?
                      <span
                        className="text-primary "
                        onClick={() => setIsLoggedIn(true)}
                      >
                        {" "}
                        Login here
                      </span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      {/* usermodal end */}
    </>
  );
};

export default Navbar;
