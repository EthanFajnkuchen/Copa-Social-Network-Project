import React from 'react';
import HeaderSection from '../components/Home/HeaderSection';
import Navbar from '../components/Home/Navbar';
import "./../styles/style.css"

const Home = () => {
    return(
        <div className="main-container">
            <Navbar />
            <HeaderSection />
        </div>
    );
};

export default Home;