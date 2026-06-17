import React from "react";
import logo from "../assets/food-logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img
          src={logo}
          alt="Food App Logo"
          className="logo"
        />
        <h2>Food App</h2>
      </div>
    </nav>
  );
};

export default Navbar;