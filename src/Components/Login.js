import React from 'react'
import fblogo from '../Imgs/fblogo.png';

import "../CSS/Login.css"

function Login() {
    return (
        <div className='login_wrapper'>
            <div className="login">
                <img src={fblogo} alt="" />
                <h2>Sign in with Facebook</h2>
                <button>Login with Facebook</button>
            </div>
        </div>
    )
}

export default Login