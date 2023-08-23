import React from 'react';
import {BrowserRouter as Router, Routes, Redirect, Route, Switch, Navigate} from "react-router-dom";
import Home from "./../../pages/Home";
import Profile from "./../../pages/Profile";
import SignIn from '../../pages/SignIn';
import AdminPage from '../../pages/AdminPage';



const index = () => {
    return (
        <Router>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signup" element={<SignIn />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/*" element={<Navigate replace to="/" />} /> 
            </Routes>
        </Router>
    );
};

export default index;
