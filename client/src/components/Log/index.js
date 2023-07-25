import React, { useState } from 'react'
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import "./../../styles/signin.css"

const Log = () => {

    const [SignUpModal, setSignUpModal] = useState(true);
    const [SignInModal, setSignInModal] = useState(false);
    const [activeButton, setActiveButton] = useState("register")

    

    const handleModals = (e) => {
        if (e.target.id === "register") {
            setSignInModal(false);
            setSignUpModal(true);
            setActiveButton("register")

        } else if (e.target.id === "login") {
            setSignUpModal(false);
            setSignInModal(true);
            setActiveButton("login")
        }
    }

    return(
        <div className='log-component'>
            <div className='connection-form'>
                <div className='form-container'>
                    <button onClick={handleModals} id="register" className={activeButton === 'register' ? 'active' : ''}>Sign Up</button>
                    <button onClick={handleModals} id="login"  className={activeButton === 'login' ? 'active' : ''}>Sign In</button>
                    {SignUpModal && <SignUpForm />}
                    {SignInModal && <SignInForm />}
                </div>
            </div>
        </div>
    );
}

export default Log;