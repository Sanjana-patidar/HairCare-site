import React, { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import './Admin.css'

const Adminlayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', transition: 'background-color 0.3s' }}>
      <Header toggleSidebar={() => setCollapsed(!collapsed)} />
      <Sidebar collapsed={collapsed} />

      <motion.div 
        className={collapsed ? "content collapsed-content" : "content"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet/>
      </motion.div>
    </div>
  );
};

export default Adminlayout;
