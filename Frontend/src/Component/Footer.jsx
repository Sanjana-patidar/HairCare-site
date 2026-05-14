import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top">

        {/* Brand */}
        <div>
          <div className="footer-brand-logo">
            <img src="/src/assets/img/womens-day.png" className="footer-logo-img" alt="Shinny Logo" />
            <span className="footer-brand-name">Shinn<span>y</span></span>
          </div>
          <p className="footer-brand-desc">
            Premium hair care products crafted with nature-powered, science-backed formulas for every hair type.
          </p>
          <div className="footer-socials">
            <a className="footer-social-btn" href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a className="footer-social-btn" href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a className="footer-social-btn" href="#" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a className="footer-social-btn" href="#" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <div className="footer-col-title">Shop</div>
          <ul className="footer-links">
            <li><Link to="/Categoryshampoo"><i className="fa-solid fa-chevron-right"></i>Shampoo</Link></li>
            <li><Link to="/Categoryconditioner"><i className="fa-solid fa-chevron-right"></i>Conditioner</Link></li>
            <li><Link to="/Categoryserum"><i className="fa-solid fa-chevron-right"></i>Serum</Link></li>
            <li><Link to="/Categoryoil"><i className="fa-solid fa-chevron-right"></i>Hair Oil</Link></li>
            <li><Link to="/allproducts"><i className="fa-solid fa-chevron-right"></i>All Products</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <div className="footer-col-title">Support</div>
          <ul className="footer-links">
            <li><span><i className="fa-solid fa-circle-question"></i>Help Center</span></li>
            <li><span><i className="fa-solid fa-rotate-left"></i>Return Policy</span></li>
            <li><span><i className="fa-solid fa-shield-halved"></i>Privacy Policy</span></li>
            <li><Link to="/contact"><i className="fa-solid fa-headset"></i>Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><span><i className="fa-solid fa-phone"></i>+91 88787 78689</span></li>
            <li><span><i className="fa-regular fa-envelope"></i>shinyy12@gmail.com</span></li>
            <li><span><i className="fa-solid fa-location-dot"></i>Main Road, Ahmedabad</span></li>
            <li><span><i className="fa-regular fa-clock"></i>Mon–Sat, 9am–6pm</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © 2025 <span>Shinny</span>. All rights reserved. Designed with ❤️
        </p>
        <div className="footer-badges">
          <span className="footer-badge">🔒 Secure Payments</span>
          <span className="footer-badge">🌿 100% Natural</span>
          <span className="footer-badge">🚚 Fast Delivery</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
