import React from 'react';
import "../styles/style.css"
import Navbar from '../components/Home/Navbar';
import endpoint from "../images/endpoints.png"

function Readme() {
    return (
        <div className='main-container'>
            <Navbar />

            <div style={{ textAlign: "center", color:"white", marginTop: "30px" }}>
                <h1>Social Network Name: Copa</h1>

                <h2 style={{marginTop:"20px"}}>Additional Pages Added:</h2>
                <p>We added the following additional pages:</p>
                <p>1. Tournaments</p>
                <p>2. Contact Us</p>

                <h2>Additional Features Added:</h2>
                <p>We added the following additional features:</p>
                <p>1. Delete Post and Comment</p>
                <p>2. Change Avatar</p>

                <h2>What Was Hard to Do?</h2>
                <p>Some of the challenges we faced while developing this project include:</p>
                <p>Implementing the Admin Page</p>
                <p>Handling Images</p>
                <p>Managing Cookies</p>

                <h2>Partners:</h2>
                <p>Our project was a collaborative effort between:</p>
                <p>Ethan Fajnkuchen, 337933568</p>
                <p>Niv Doron, 322547282 </p>
                <p>We worked together on all aspects of the project.</p>

                <h2>Server Routes:</h2>
                <p>Here are the different server routes supported by our app:</p>
                <img style={{ width: "40em" }} src={endpoint} />
            </div>
        </div>
    );
}

export default Readme;
