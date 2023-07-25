import React from 'react'

const SignInForm = () => {
    return(
        <div className="sign-in-component">
            <h4>Welcome Back!</h4>
            <form>
                <input type="email" name="email" placeholder='Email'  required/><br />
                <input type="password" name="password" placeholder='Password' required/><br />
                <div class="checkbox-container">
                    <input id="checkbox" type="checkbox" name="remember-me"></input>
                    <label for="remember-me">Remember Me</label><br />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default SignInForm;