import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./../../styles/style.css";
import logo from "./../../images/logo.png";

const Navbar = () => {
  const [adminPages, setAdminPages] = useState({ page1: false, page2: false });

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/admin/pages')
      .then((response) => {
        console.log(response.data)
        setAdminPages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching admin pages:', error);
      });
  }, []);

  return (
    <div className='navbar-before'>
      <div className='navbar-component'>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand" href="/">
            <img className="logo" src={logo} alt="Logo" />
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
                <a className="nav-link" href="/readme">
                  Read Me
                </a>
              </li>

              {adminPages.page1 && (
                <li className="nav-item">
                  <a className="nav-link" href="/about-us">
                    About Us
                  </a>
                </li>
              )}

              {adminPages.page2 && (
                <li className="nav-item">
                  <a className="nav-link" href="/tournaments">
                    Tournaments
                  </a>
                </li>
              )}

              <li className="nav-item">
                <a className="nav-link" href="/signup?source=navbar">
                  Sign In
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
