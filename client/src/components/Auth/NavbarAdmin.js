import React, { useContext } from 'react';
import axios from 'axios';
import logo from "./../../images/logo-color.png"
import { AppBar, Toolbar, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { UidContext } from '../Log/AppContext';
import cookie from "js-cookie";



const NavbarAdmin = () => {
    
    const uid = useContext(UidContext);
    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, { expires: 1 });
        }
    };

    const handleLogout = async () => {
        const logoutUrl = `http://localhost:5000/api/user/logout/${uid}`;

        await axios({
            method: "get",
            url: logoutUrl,
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
                            outline: "none",
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
