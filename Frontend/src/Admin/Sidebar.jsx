import React from "react";
import {  FiUser, FiSettings, FiBox } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const handlelogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    Swal.fire({
    icon: "success",
    title: "Logged out successfully",
    timer: 1200,
    showConfirmButton: false,
  });

  setTimeout(()=>{
    navigate("/");
  }, 1200);

  }
  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-menu">
        
        <NavLink to="/admin" >
        {({isActive}) =>(
          <div className={`item ${isActive ? "active-tab":""}`}>
          <RxDashboard/>
          {!collapsed && <span>Dashboard</span>}
        </div>
        )}
        </NavLink>

        <NavLink to="/admin/user">
            {({ isActive }) => (
              <div className={`item ${isActive ? "active-tab" : ""}`}>
                <FiUser />
                {!collapsed && <span>Users</span>}
              </div>
            )}
        </NavLink>

       <NavLink to="/admin/product">
        {({isActive}) =>(
          <div className={`item ${isActive ? "active-tab":""}`}>
          <FiBox />
          {!collapsed && <span>Products</span>}
        </div>
        )}
       </NavLink>

        <NavLink to="/admin/addproduct">
        {({isActive}) =>(
          <div className={`item ${isActive ? "active-tab":""}`}>
          <MdOutlineLibraryAdd />
          {!collapsed && <span>AddProduct</span>}
        </div>
        )}
        </NavLink>

        <NavLink to="/admin/setting">
          {({isActive}) =>(
            <div className={`item ${isActive ? "active-tab":""}`}>
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </div>
          )}
        </NavLink>
        
          <div className="item " onClick={handlelogout}>
          <IoMdLogOut  style={{cursor:"pointer"}}/>
          {!collapsed && <span>Logout</span>}
          </div>
       
       
      </div>
    </div>
  );
};

export default Sidebar;
