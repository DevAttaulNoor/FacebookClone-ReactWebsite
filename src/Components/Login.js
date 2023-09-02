import "../CSS/Login.css"
import React from 'react'
import { auth, provider } from './Firebase';
import { useStateValue } from './StateProvider'
import fblogo from '../Imgs/fblogo.png';

function Login() {
    const [{}, dispatch] = useStateValue();
    const signIn = () => {
        auth.signInWithPopup(provider).then((result) => {
            var credential = result.credential;
            const photoURL = `${result.user.photoURL}?access_token=${credential.accessToken}`;
            // console.log(result)

            dispatch({
                type: "SET_USER",
                user:{
                    displayName: result.user.displayName,
                    photoURL: photoURL
                }
            })
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