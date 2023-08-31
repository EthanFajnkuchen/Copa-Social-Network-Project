import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./../../pages/Home";
import Profile from "./../../pages/Profile";
import SignIn from '../../pages/SignIn';
import AdminPage from '../../pages/AdminPage';
import Feed from '../../pages/Feed';
import Search from '../../pages/Search';
import ProfileOther from '../../pages/ProfileOther';
import { UidContext } from '../Log/AppContext';
import axios from "axios";
import { Avatar, Grid, Paper, Typography, Card, CardContent, Box, Container } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


const Index = () => {
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
      const fetchToken = async () => {
        try {
          const response = await axios.get('http://localhost:5000/jwtid', { withCredentials: true });
          setUid(response.data);
          console.log(response);
          setLoading(false);
        } catch (error) {
          console.log('No token');
        }
      };
  
      fetchToken();
    }, [uid]);


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center'}}>
              <CircularProgress />
            </Box>
          );    
    }

  return (
    uid ? 
(        <Router>
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signup" element={<SignIn />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/searchUser" element={<Search />} />
                <Route path="/profile/:userId" element={<ProfileOther />} />
                <Route path="/*" element={<Navigate replace to="/" />} /> 
        </Routes>
    </Router>) : 
    (<Router>
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<SignIn />} />
                <Route path="/signup" element={<SignIn />} />
                <Route path="/admin" element={<SignIn />} />
                <Route path="/feed" element={<SignIn />} />
                <Route path="/searchUser" element={<SignIn />} />
                <Route path="/profile/:userId" element={<SignIn />} />
                <Route path="/*" element={<Navigate replace to="/" />} /> 
        </Routes>
    </Router>)
);
};

export default Index;
