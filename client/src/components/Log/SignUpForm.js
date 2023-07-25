import React from 'react'

const SignUpForm = () => {
    return(
        <div className='sign-up-component'>
            <h4>New Here ?</h4>
            <form>
                <input type="text" name="firstName" placeholder='First Name' /><br />
                <input type="text" name="lastName" placeholder='Last Name' /><br />
                <input type="email" name="email" placeholder='Email' /><br />
                <input type="password" name="password" placeholder='Password' /><br />
                <button type="submit" className='signup'>Sign Up</button>   
            </form>
        </div>
    )
}

export default SignUpForm;