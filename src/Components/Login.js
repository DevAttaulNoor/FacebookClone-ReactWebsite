import React from 'react'
import fblogo from '../Imgs/fblogo.png';
import "../CSS/Login.css"
import { auth, provider } from './Firebase';

function Login() {
    const signIn = () => {
        auth.signInWithPopup(provider).then((result) => {
            console.log(result);
        })
        .catch((error) => {
            if (error.code === 'auth/popup-closed-by-user') {
                // Handle the popup closed by the user
                console.log("Authentication popup closed by user.");
            } else {
                // Handle other authentication errors
                console.error("Authentication error:", error);
            }
        });
    }

    return (
        <div className='login_wrapper'>
            <div className="login">
                <img src={fblogo} alt="" />
                <h2>Sign in with Facebook</h2>
                <button onClick={signIn}>Login with Facebook</button>
            </div>
        </div>
    )
}

export default Login