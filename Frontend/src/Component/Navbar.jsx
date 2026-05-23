import React from "react";
import { useState, useRef, useEffect } from "react";
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Navbar.css";
import logoImg from '../assets/img/womens-day.png';

const Navbar = ({ openCart }) => {

  // cart context
  const { cartItems, clearCart } = useCart();
  const totalProducts = cartItems.length;

  // wishlist context
  const { wishlistItems, clearWishlist, fetchWishlist } = useWishlist();
  const totalWishlistItems = wishlistItems.length;

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Solid navbar after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // state for user modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // state for login/signup
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token"); // true if token exists
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMode, setModalMode] = useState("login"); // login, signup, forgot, reset
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");


  // state for user input
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    clearCart();
    clearWishlist();
    setIsLoggedIn(false);
    toast.warning("Logged out successfully");

    navigate("/");
  };

  // Close mobile navbar on link click
  const closeMobileMenu = () => {
    const collapse = document.getElementById("navbarSupportedContent");
    const toggler = document.querySelector(".navbar-toggler");
    if (collapse && collapse.classList.contains("show") && toggler) {
      toggler.click();
    }
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
        if (modalMode === "login") {
          emailRef.current && emailRef.current.focus();
        } else if (modalMode === "signup") {
          usernameRef.current && usernameRef.current.focus();
        }
      }, 100);
    }
  }, [show, modalMode]);
  // handleSignup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmPassword) {
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
      setModalMode("login"); // redirect to login
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Signup Failed");
    }

  }
  // handleLogin function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: formdata.email,
        password: formdata.password,
      });

      const { token, user, username } = response.data;
      //store the user token and role in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username);


      // success alert
      toast.success("Login successfully");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      fetchWishlist(); // fetch wishlist on login

      //role based redirect
      setTimeout(() => {
        if (user.role == "admin") {
          navigate("/admin");
        }
        else {
          navigate("/");
        }
      })
      handleClose();
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  // handleForgotPassword
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formdata.email) {
      return toast.warning("Please enter your email");
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password`, { email: formdata.email });
      toast.success("OTP sent to your email!");
      setModalMode("reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // handleResetPassword
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== formdata.confirmPassword) {
      return toast.warning("Passwords do not match");
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        email: formdata.email,
        otp: otp,
        newPassword: newPassword
      });
      toast.success("Password reset successfully!");
      setModalMode("login");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const [userProfile, setUserProfile] = useState(null);

  // Fetch real profile from API whenever logged in state changes
  useEffect(() => {
    const fetchProfileData = () => {
      const token = localStorage.getItem("token");
      if (!token) { setUserProfile(null); return; }
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUserProfile(res.data))
        .catch(() => setUserProfile(null));
    };

    fetchProfileData();

    // Listen for profile updates from other components
    window.addEventListener('profileUpdated', fetchProfileData);
    return () => window.removeEventListener('profileUpdated', fetchProfileData);
  }, [isLoggedIn]);

  const displayName  = userProfile?.username || localStorage.getItem("username") || "";
  const firstLetter  = displayName.charAt(0).toUpperCase();
  const profileImage = userProfile?.profileImage || "";

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light premium-navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="container-fluid">
          <a className="navbar-brand hvr-grow">
            <h3 className="logo-text">
              <img src={logoImg} className="logo" alt="Shinny Logo" />
              Shinn<span className="brand-accent">y</span>
            </h3>
          </a>

          <div className="d-flex align-items-center ms-auto order-lg-last">
            {/* Right icons (Always visible on top bar) */}
            <div className="search-bar d-flex align-items-center gap-2 me-2 me-lg-0">
              {/* DESKTOP ONLY: Wishlist & Cart */}
              <div className="d-none d-lg-flex align-items-center gap-2">
                {/* Wishlist */}
                <Link to="/wishlist" className="nav-icon-btn">
                  <i className="fa-solid fa-heart"></i>
                  {wishlistItems.length > 0 && (
                    <span className="nav-badge">{totalWishlistItems}</span>
                  )}
                </Link>

                {/* Cart */}
                <button className="nav-icon-btn" onClick={openCart}>
                  <i className="fa-solid fa-cart-arrow-down"></i>
                  {cartItems.length > 0 && (
                    <span className="nav-badge">{totalProducts}</span>
                  )}
                </button>
              </div>

              {/* ALWAYS VISIBLE: User Profile/Login */}
              <div className="cart-icon">
                {localStorage.getItem("token") ? (
                  <div className="dropdown">
                    <button
                      className="border-0 bg-transparent nav-avatar-btn dropdown-toggle"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {profileImage ? (
                        <img src={`${import.meta.env.VITE_API_IMAGE}/${profileImage}`} alt={displayName} className="nav-avatar-img" />
                      ) : (
                        <span className="nav-avatar-letter">{firstLetter}</span>
                      )}
                      <span className="nav-username-text">{displayName}</span>
                    </button>
                    <ul className="dropdown-menu nav-dropdown" aria-labelledby="dropdownMenuButton1">
                      <li className="nav-drop-header">
                        <div className="nav-drop-avatar">
                          {profileImage ? (
                            <img src={`${import.meta.env.VITE_API_IMAGE}/${profileImage}`} alt={displayName} className="nav-drop-avatar-img" />
                          ) : (
                            <span className="nav-drop-avatar-letter">{firstLetter}</span>
                          )}
                        </div>
                        <div>
                          <div className="nav-drop-name">{displayName}</div>
                          <div className="nav-drop-email">{userProfile?.email || ""}</div>
                        </div>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item nav-drop-item" to="/profile">
                          <i className="fa-solid fa-user" /> My Account
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item nav-drop-item" to="/placeorder">
                          <i className="fa-solid fa-box" /> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item nav-drop-item" to="/wishlist">
                          <i className="fa-solid fa-heart" /> My Wishlist
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li onClick={handleLogout}>
                        <a className="dropdown-item nav-drop-item nav-drop-logout" href="#">
                          <i className="fa-solid fa-right-from-bracket" /> Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button className="nav-login-btn" onClick={() => { setModalMode("login"); handleShow(); }}>
                    <i className="fa-solid fa-user"></i>
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <Link to="/" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Home</a></li>
              </Link>
              <Link to="/Categoryshampoo" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Shampoo</a></li>
              </Link>
              <Link to="/Categoryconditioner" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Conditioner</a></li>
              </Link>
              <Link to="/Categoryserum" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Serum</a></li>
              </Link>
              <Link to="/Categoryoil" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Oil</a></li>
              </Link>
              <Link to="/contact" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Contact</a></li>
              </Link>
              <Link to="/placeorder" className="text-decoration-none" onClick={closeMobileMenu}>
                <li className="nav-item"><a className="nav-link">Orders</a></li>
              </Link>
            </ul>

            {/* MOBILE ONLY: Wishlist & Cart inside toggle */}
            <div className="d-flex d-lg-none align-items-center gap-3 mt-3 pt-3 border-top" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
              {/* Wishlist */}
              <Link to="/wishlist" className="nav-icon-btn flex-fill" onClick={closeMobileMenu}>
                <i className="fa-solid fa-heart"></i>
                {wishlistItems.length > 0 && (
                  <span className="nav-badge">{totalWishlistItems}</span>
                )}
                <span className="ms-2 font-weight-bold" style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nav-icon-btn flex-fill text-decoration-none" onClick={closeMobileMenu}>
                <i className="fa-solid fa-cart-arrow-down"></i>
                {cartItems.length > 0 && (
                  <span className="nav-badge">{totalProducts}</span>
                )}
                <span className="ms-2 font-weight-bold" style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Cart</span>
              </Link>
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
              {modalMode === "login" && (
                <>
                  <h2>Welcome! <p>Login into your Account</p></h2>
                  <form onSubmit={handleLogin}>
                    <div>
                      <input type="email" name="email" placeholder="Email" onChange={handleChange} ref={emailRef} />
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
                      <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
                        style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "gray" }}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                    <div className="text-end mt-1">
                      <span className="text-primary" style={{cursor: "pointer", fontSize: "14px"}} onClick={() => setModalMode("forgot")}>Forgot Password?</span>
                    </div>
                    <div>
                      <button type="submit" className="btn-1">Login</button>
                    </div>
                    <div className="switch-text">
                      <p>
                        Don’t have an account?
                        <span className="text-primary" style={{cursor: "pointer"}} onClick={() => setModalMode("signup")}> Sign up here</span>
                      </p>
                    </div>
                  </form>
                </>
              )}

              {modalMode === "signup" && (
                <>
                  <h2>Create an Account</h2>
                  <form onSubmit={handleSignup}>
                    <div>
                      <input type="text" name="username" placeholder="Username" onChange={handleChange} ref={usernameRef} />
                    </div>
                    <div>
                      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
                      <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
                        style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "gray" }}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
                      <i
                        className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
                        style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "gray" }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      ></i>
                    </div>
                    <div>
                      <button type="submit" className="btn-1">Sign Up</button>
                    </div>
                    <div className="switch-text">
                      <p>
                        Already have an account?
                        <span className="text-primary" style={{cursor: "pointer"}} onClick={() => setModalMode("login")}> Login here</span>
                      </p>
                    </div>
                  </form>
                </>
              )}

              {modalMode === "forgot" && (
                <>
                  <h2>Forgot Password</h2>
                  <p className="mb-4 text-muted" style={{fontSize: "14px"}}>Enter your email to receive an OTP.</p>
                  <form onSubmit={handleForgotPassword}>
                    <div>
                      <input type="email" name="email" placeholder="Email" onChange={handleChange} ref={emailRef} />
                    </div>
                    <div>
                      <button type="submit" className="btn-1">Send OTP</button>
                    </div>
                    <div className="switch-text mt-3">
                      <span className="text-primary" style={{cursor: "pointer"}} onClick={() => setModalMode("login")}><i className="fa-solid fa-arrow-left"></i> Back to Login</span>
                    </div>
                  </form>
                </>
              )}

              {modalMode === "reset" && (
                <>
                  <h2>Reset Password</h2>
                  <p className="mb-4 text-muted" style={{fontSize: "14px"}}>Enter the OTP sent to <b>{formdata.email}</b></p>
                  <form onSubmit={handleResetPassword}>
                    <div>
                      <input type="text" placeholder="6-digit OTP" onChange={(e) => setOtp(e.target.value)} value={otp} required maxLength={6} />
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
                      <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
                        style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "gray" }}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm New Password" onChange={handleChange} required />
                      <i
                        className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
                        style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "gray" }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      ></i>
                    </div>
                    <div>
                      <button type="submit" className="btn-1">Update Password</button>
                    </div>
                    <div className="switch-text mt-3">
                      <span className="text-primary" style={{cursor: "pointer"}} onClick={() => setModalMode("login")}><i className="fa-solid fa-arrow-left"></i> Back to Login</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>

      {/* usermodal end */}
    </>
  );
};

export default Navbar;
