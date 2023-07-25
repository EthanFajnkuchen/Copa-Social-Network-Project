import React from 'react';
import {BrowserRouter as Router, Routes, Redirect, Route, Switch, Navigate} from "react-router-dom";
import Home from "./../../pages/Home";
import Profile from "./../../pages/Profile";
import SignIn from '../../pages/SignIn';



const index = () => {
    return (
        <Router>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/*" element={<Navigate replace to="/" />} /> 
            </Routes>
        </Router>
    );
};

export default index;
