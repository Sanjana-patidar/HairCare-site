import React, { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import './Admin.css'

const Adminlayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Header toggleSidebar={() => setCollapsed(!collapsed)} />
      <Sidebar collapsed={collapsed} />

      <div className={collapsed ? "content collapsed-content" : "content"}>
        <Outlet/>
      </div>
    </>
  );
};

export default Adminlayout;
