import React, { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";

const Header = ({ toggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.body.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.body.removeAttribute("data-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("adminTheme", "light");
      setIsDark(false);
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("adminTheme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <motion.div 
      className="header"
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FiMenu className="menu-icon" onClick={toggleSidebar} />
      <h4 className="admin-title">Admin Hub</h4>
      
      {/* Right side controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle Light/Dark Mode">
          {isDark ? <FiSun /> : <FiMoon />}
        </div>
        
        <div 
          className="theme-toggle" 
          onClick={handleLogout} 
          title="Logout"
          style={{ color: '#ef4444' }}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M160 241.1l111.4-111.4c6.2-6.2 16.4-6.2 22.6 0 6.2 6.2 6.2 16.4 0 22.6L201.3 245h214.7c8.8 0 16 7.2 16 16s-7.2 16-16 16H201.3l92.7 92.7c6.2 6.2 6.2 16.4 0 22.6-6.2 6.2-16.4 6.2-22.6 0L160 270.9c-8.3-8.3-8.3-21.5 0-29.8zM416 48v416c0 26.5-21.5 48-48 48H144c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48h224c26.5 0 48 21.5 48 48zm-32 0c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16v416c0 8.8 7.2 16 16 16h224c8.8 0 16-7.2 16-16V48z"></path></svg>
        </div>
        
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          A
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
