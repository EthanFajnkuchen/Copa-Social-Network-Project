import React from "react";
import "./style.css";
import logo from"./images/logo.png"


const Navbar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="#">
          <img className="logo" src={logo}alt="Logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarTogglerDemo02"
        >
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <a className="nav-link" href="">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">
                Sign In
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  export default Navbar;
