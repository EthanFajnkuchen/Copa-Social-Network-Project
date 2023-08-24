import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import "./../styles/style.css";
import { UidContext } from '../components/Log/AppContext';

const Profile = () => {
    const uid = useContext(UidContext);
    const navigate = useNavigate(); // Initialize the useNavigate hook
    console.log(uid);

    if (!uid) {
        // If user is not signed in, navigate to the sign-in page
        navigate('/signin');
        return null; // Return null to avoid rendering anything for now
    }

    if (uid === "6acba3b3-b13c-49b7-b7b1-ac7174267c80") {
        // If the user is the admin, navigate to the admin page
        navigate('/admin');
        return null;
    }

    // If it's a regular user, display the profile page
    return (
        <div className='profile-page'>
            {/* Profile page content */}
            <h5>Profile Page</h5>
        </div>
    );
};

export default Profile;
