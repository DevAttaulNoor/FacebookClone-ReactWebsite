import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, provider } from './Firebase';
import { useStateValue } from './StateProvider'
import fblogo from '../Imgs/fblogo.png';
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [{ }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(true);
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
    const navigate = useNavigate();

    if (isUserLoggedOut === 'true') {
        sessionStorage.removeItem('userLoggedOut');
    }

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log(result)
                var credential = result.credential;
                const photoURL = `${result.user.photoURL}?access_token=${credential.accessToken}`;
                const displayName = result.user.displayName;

                // Save user data in session storage
                const userData = {
                    displayName: displayName,
                    photoURL: photoURL
                };

                // Store the user data in session storage
                sessionStorage.setItem('userData', JSON.stringify(userData));

                dispatch({
                    type: "SET_USER",
                    user: userData
                });

                // Redirect the user to the home page after successful login
                navigate('/');
            })
            .catch((error) => {
                if (error.code === 'auth/popup-closed-by-user') {
                    console.log("Authentication popup closed by user.");
                } else {
                    console.error("Authentication error:", error);
                }
            });
    }

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');

        if (storedUserData) {
            // If user data is found in session storage, parse it and set it in the context
            const userData = JSON.parse(storedUserData);
            dispatch({
                type: "SET_USER",
                user: userData
            });
        }

        setIsLoading(false);
    }, []);

    // Render a loading indicator while authentication state is being checked
    if (isLoading) {
        return <Loading />;
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

export default Login;