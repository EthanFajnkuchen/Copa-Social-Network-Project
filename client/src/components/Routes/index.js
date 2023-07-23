import React from 'react';
import {BrowserRouter as Router, Routes, Redirect, Route, Switch, Navigate} from "react-router-dom";
import Home from "./../../pages/Home";
import Profil from "./../../pages/Profil";
import "./../../styles/style.css"



const index = () => {
    return (
        <Router>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
};

export default index;
