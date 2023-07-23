import React from 'react';
import HeaderSection from '../components/HeaderSection';
import Navbar from '../components/Navbar';
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