import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./../../styles/styleafter.css";
import logo from "./../../images/logo-color.png"
import { AppBar, Toolbar, Typography, TextField, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { Logout } from '@mui/icons-material';
import { UidContext } from '../Log/AppContext';
import cookie from "js-cookie";



const NavbarAdmin = () => {

    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, { expires: 1 });
        }
    };

    const handleLogout = async () => {
        await axios({
            method: "get",
            url: `http://localhost:5000/api/user/logout`,
            withCredentials: true,
        })
            .then(() => removeCookie("token"))
            .catch((err) => console.log(err));

        window.location = "/";
    };


    return (
        <AppBar position="static" style={{ backgroundColor: 'white', boxShadow: 'none', height: "5rem"}}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="/admin">
                        <img className="logo" src={logo} alt="Logo" style={{ width: "7rem", marginLeft : "3rem" }} />
                    </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        style={{
                            color: '#549BFF',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={handleLogout}
                    >
                        <Logout />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavbarAdmin;
