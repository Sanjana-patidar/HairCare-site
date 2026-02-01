import React from "react";
import { useState, useRef,useEffect } from "react";
import {useCart} from '../Context/CartContext';
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { Link } from "react-router-dom" 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Navbar.css";

const Navbar = ({openCart}) => {
 
  // cart context
  const { cartItems,clearCart } = useCart();
  const totalProducts = cartItems.length;
  const navigate = useNavigate();
  // state for user modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // state for login/signup
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return !!localStorage.getItem("token"); // true if token exists
});


  // state for user input
  const [formdata, setFormdata] = useState({
    username: "",
    email:"",
    password:"",
    confirmPassword:""
  });
// logout function
   const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
  clearCart();       
 setIsLoggedIn(false);   
  toast.warning("Logged out successfully");

  navigate("/");
};


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
        emailRef.current && emailRef.current.focus(); 
      } else {
        usernameRef.current && usernameRef.current.focus();   
      }
    }, 100);
  }
}, [show, isLoggedIn]);
// handleSignup
const handleSignup = async (e) =>{
  e.preventDefault();
  if(formdata.password !== formdata.confirmPassword){
      toast.warning("password do not match");
    return;
}
   try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
      username: formdata.username,
      email: formdata.email,
      password: formdata.password,
      confirmPassword: formdata.confirmPassword,
    });

    toast.success("Signup successfully");
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
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
      email: formdata.email,
      password: formdata.password,
    });

   const {token, user} = response.data;
  //store the user token and role in local storage
  localStorage.setItem("token", token);
  localStorage.setItem("role", user.role);

  // success alert
  toast.success("Login successfully");
setIsLoggedIn(true);
localStorage.setItem("isLoggedIn", "true");

//role based redirect
setTimeout(()=>{
  if(user.role == "admin"){
    navigate("/admin");
  }
  else{
    navigate("/");
  }
})
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
          <a class="navbar-brand hvr-grow">
            <h3 className="logo-text text-warning"> <img  src="/src/assets/img/womens-day.png" className="logo" alt="" />Shinny</h3>
          </a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav m-auto mb-2 mb-lg-0 gap-3">
              <Link to="/" className="text-decoration-none">
              <li class="nav-item hvr-underline-from-center">
                <a class="nav-link " href="#">
                  Home
                </a>
              </li>
             </Link>
              <Link to="/Categoryshampoo" className="text-decoration-none">
                <li class="nav-item hvr-underline-from-center">
                <a class="nav-link" href="#">
                  Shampoo
                </a>
              </li>
              </Link>
             <Link to="/Categoryconditioner">
                <li class="nav-item hvr-underline-from-center">
                  <a class="nav-link" href="#">
                  Conditioner
                </a>
              </li>
             </Link>
              <Link to="/Categoryserum">
                <li class="nav-item hvr-underline-from-center">
                 <a class="nav-link" href="#">
                  Serum
                 </a>
              </li>
              </Link>
               <Link to="/Categoryoil" className="text-decoration-none">
                 <li class="nav-item hvr-underline-from-center">
                <a class="nav-link" href="#">
                  Oil
                </a>
              </li>
               </Link>
             <Link to="/contact" className="text-decoration-none ">
              <li class="nav-item hvr-underline-from-center">
                <a class="nav-link " href="#">
                  Contact
                </a>
              </li>
             </Link>
             <Link to="/placeorder" className="text-decoration-none">
              <li class="nav-item hvr-underline-from-center">
                <a class="nav-link " href="#">
                Order
                </a>
              </li>
             </Link>
            </ul>
          </div>
          <div>
              <div className="search-bar d-flex align-items-center ">
                <div  className="me-3 cart-icon">
                  <i class="fa-solid fa-heart hvr-grow fs-4"></i>
                  {<span style={{color:"rgb(192, 223, 54)",fontSize:"20px"}}></span>}
                </div>
                <div onClick={openCart} className="me-3 cart-icon">
                  <i class="fa-solid fa-cart-arrow-down fs-5 hvr-grow"></i>
                  {cartItems.length > 0 && <span style={{color:"rgb(192, 223, 54)",fontSize:"20px"}}>({totalProducts})</span>}
                </div>
                <div className="cart-icon">
                  {localStorage.getItem("token") ? (
                    <button onClick={handleLogout} className="btn btn-sm btn-warning">
                      Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                  ) : (
                    <div onClick={handleShow}>
                      <i className="fa-solid fa-user fs-5 hvr-grow"></i>
                    </div>
                  )}
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
