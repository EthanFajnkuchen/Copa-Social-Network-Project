import React, { useState } from 'react';
import axios from 'axios';

const SignInForm = () => {
    const [formData, setFormData] = useState({
        pseudo: '',
        password: '',
        rememberMe: false // Add this state for the "Remember Me" checkbox
    });


    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/user/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: true,
            });
            console.log('Login successful:', response.data.token);

            setIncorrectCredentials(false);
            window.location = '/profile'; 

            // Handle successful login, e.g., redirect to a dashboard page
        } catch (error) {
            console.log('Error logging in:', error);
            if (error.response && error.response.status === 401) {
                setIncorrectCredentials(true);
            }
        }
    };

    return (
        <div className="sign-in-component">
            <h4>Welcome Back!</h4>
            {incorrectCredentials && <p style={{ color: 'red', fontSize: '12px', marginBottom: '20px' }}>Pseudo or password is incorrect.</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="pseudo" placeholder="Pseudo" onChange={handleChange} value={formData.pseudo} required /><br />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required /><br />
                <div className="checkbox-container">
                    <input id="checkbox" type="checkbox" name="rememberMe" onChange={handleChange} checked={formData.rememberMe} />
                    <label htmlFor="rememberMe">Remember Me</label><br />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default SignInForm;