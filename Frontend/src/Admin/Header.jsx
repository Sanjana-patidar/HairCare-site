import React from "react";
import { FiMenu } from "react-icons/fi";

const Header = ({ toggleSidebar }) => {
  return (
    <div className="header">
       <FiMenu className="menu-icon" onClick={toggleSidebar} />
      <h4>Shinny Admin Panel</h4>
    </div>
  );
};

export default Header;
