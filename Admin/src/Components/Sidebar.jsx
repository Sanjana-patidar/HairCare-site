import React from "react";
import { FiUser, FiSettings, FiBox } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { MdOutlineLibraryAdd } from "react-icons/md";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    Swal.fire({
      icon: "success",
      title: "Logged out successfully",
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  const navItems = [
    { path: "/admin", name: "Dashboard", icon: <RxDashboard /> },
    { path: "/admin/user", name: "Users", icon: <FiUser /> },
    { path: "/admin/product", name: "Products", icon: <FiBox /> },
    { path: "/admin/addproduct", name: "Add Products", icon: <MdOutlineLibraryAdd /> },
    { path: "/admin/brand", name: "Brands", icon: <LocalOfferIcon /> },
    { path: "/admin/addbrand", name: "Add Brands", icon: <MdOutlineLibraryAdd /> },
    { path: "/admin/orderhistory", name: "Order History", icon: <ShoppingCartIcon /> },
    { path: "/admin/setting", name: "Settings", icon: <FiSettings /> },
  ];

  return (
    <motion.div 
      className={`sidebar ${collapsed ? "collapsed" : "mobile-open"}`}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="sidebar-menu" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        
        {navItems.map((item, index) => (
          <NavLink key={index} to={item.path} end={item.path === "/admin"}>
            {({ isActive }) => (
              <motion.div 
                className={`item ${isActive ? "active-tab" : ""}`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </motion.div>
            )}
          </NavLink>
        ))}

        <div className="logout-item">
          <motion.div 
            className="item" 
            onClick={handlelogout}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoMdLogOut style={{ cursor: "pointer" }} />
            {!collapsed && <span>Logout</span>}
          </motion.div>
        </div>
        
      </div>
    </motion.div>
  );
};

export default Sidebar;
