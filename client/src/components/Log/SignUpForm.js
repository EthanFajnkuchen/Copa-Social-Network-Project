import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pseudo: '',
        password: ''
    });

    const [pseudoExists, setPseudoExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);

    useEffect(() => {
        checkPseudoExists(formData.pseudo);
    }, [formData.pseudo]);

    useEffect(() => {
        checkEmailExists(formData.email);
    }, [formData.email]); 

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const checkPseudoExists = async (pseudo) => {
        try {
            const response = await axios.get(`http://localhost:5000/check-pseudo/${pseudo}`);
            setPseudoExists(response.data.exists);
        } catch (error) {
            console.log('Error checking pseudo:', error);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:5000/check-email/${email}`);
            setEmailExists(response.data.exists);
        } catch (error) {
            console.log('Error checking email:', error);
        }
    };

    
    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        console.log(formData);

        try {
            const response = await axios.post('http://localhost:5000/register', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });
            console.log(formData);
            console.log('User registered:', response.data);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                pseudo: '',
                password: ''
            });
        } catch (error) {
            console.log('Error registering user:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
            }
        }
    };

    return (
        <div className='sign-up-component'>
            <h4>New Here ?</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder='First Name' onChange={handleChange} value={formData.firstName} required /><br />
                <input type="text" name="lastName" placeholder='Last Name' onChange={handleChange} value={formData.lastName} required /><br />
                <input type="email" name="email" placeholder='Email' onChange={handleChange} value={formData.email} required />{emailExists && <p style={{color: 'red', fontSize: '12px', margin: '0px'}}>Email already exists.</p>}<br />
                <input type="text" name="pseudo" placeholder='Pseudo' onChange={handleChange} value={formData.pseudo} required />{pseudoExists && <p style={{color: 'red', fontSize: '12px', margin: '0px'}}>Pseudo already exists.</p>}<br />                
                <input type="password" name="password" placeholder='Password' onChange={handleChange} value={formData.password} required /><br />
                <button type="submit" className='signup' disabled={pseudoExists || emailExists}>Sign Up</button>   
            </form>
        </div>
    )
}

export default SignUpForm;
