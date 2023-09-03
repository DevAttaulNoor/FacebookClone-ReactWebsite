import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, provider } from './Firebase';
import { useStateValue } from './StateProvider'
import fblogo from '../Imgs/fblogo.png';

function Login() {
    const [{ }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(true); // Added loading state

    const signIn = () => {
        auth.signInWithPopup(provider).then((result) => {
            console.log(result)
            var credential = result.credential;
            // Append the access token to the photoURL
            const photoURL = `${result.user.photoURL}?access_token=${credential.accessToken}`;
            const { displayName } = result.user;

            dispatch({
                type: "SET_USER",
                user: {
                    displayName,
                    photoURL
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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log(authUser)
            if (authUser) {
                // User is signed in, set the user in the context
                // Append the access token to the photoURL
                const { photoURL, displayName } = authUser;
                const accessToken = 'AccessToken.getCurrentAccessToken()'; // You may need to retrieve the access token from authUser if it's available there
                const photoURLWithToken = `${photoURL}?access_token=${accessToken}`;

                dispatch({
                    type: "SET_USER",
                    user: {
                        displayName,
                        photoURL: photoURLWithToken
                    }
                })
            } else {
                // No user is signed in, set the user to null or an initial state
                dispatch({
                    type: "SET_USER",
                    user: null,
                });
            }

            // Authentication state check is complete, stop loading
            setIsLoading(false);
        });

        return () => {
            unsubscribe(); // Unsubscribe when the component unmounts
        };
    }, []);

    // Render a loading indicator while authentication state is being checked
    if (isLoading) {
        return (
            <div>Loading...</div> // You can use a loading spinner or other UI here
        );
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
