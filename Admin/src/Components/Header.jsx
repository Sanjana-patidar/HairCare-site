import React, { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import NotificationBell from "./NotificationBell";

const API = "http://localhost:5000/api/users";

const Header = ({ toggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);
  const [adminName, setAdminName] = useState("");

  // Load theme & fetch admin profile
  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.body.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.body.removeAttribute("data-theme");
    }

    // Fetch real admin name for avatar
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => setAdminName(data.username || ""))
        .catch(() => {});
    }

    // Sync theme if changed from Settings page
    const onThemeChange = (e) => {
      setIsDark(e.detail === "dark");
    };
    window.addEventListener("adminThemeChanged", onThemeChange);
    return () => window.removeEventListener("adminThemeChanged", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    if (next) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("adminTheme", "light");
    }
    setIsDark(next);
    window.dispatchEvent(new CustomEvent("adminThemeChanged", { detail: next ? "dark" : "light" }));
  };

  const initial = adminName ? adminName[0].toUpperCase() : "A";

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
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle Light/Dark Mode">
          {isDark ? <FiSun /> : <FiMoon />}
        </div>

        {/* Dynamic Notification Bell */}
        <NotificationBell />

        {/* Admin Avatar */}
        <div
          title={adminName || "Admin"}
          style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "linear-gradient(135deg,#4f46e5,#3b82f6)",
            color: "white", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: "700", fontSize: "1rem",
            cursor: "default", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(79,70,229,0.35)"
          }}
        >
          {initial}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;

