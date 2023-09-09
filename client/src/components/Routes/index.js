import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./../../pages/Home";
import Profile from "./../../pages/Profile";
import SignIn from '../../pages/SignIn';
import AdminPage from '../../pages/AdminPage';
import Feed from '../../pages/Feed';
import Search from '../../pages/Search';
import ProfileOther from '../../pages/ProfileOther';
import Testimonial from "../../pages/Testimonial"
import axios from "axios";
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Readme from '../../pages/ReadMe';



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
                <Route path="/" element={<Feed />} />
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
                <Route path="/signup" element={<SignIn />} />
                <Route path="/readme" element={<Readme />} />
                <Route path="/testimonials" element={<Testimonial />} />
                <Route path="/*" element={<Navigate replace to="/" />} /> 
        </Routes>
    </Router>)
);
};

export default Index;
