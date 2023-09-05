import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, provider } from './Firebase';
import { useStateValue } from './StateProvider'
import fblogo from '../Imgs/fblogo.png';

function Login() {
    const [{ }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(true); // Added loading state

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
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
            })
            .catch((error) => {
                if (error.code === 'auth/popup-closed-by-user') {
                    console.log("Authentication popup closed by user.");
                } else {
                    console.error("Authentication error:", error);
                }
            });
    }


    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((authUser) => {
    //         console.log(authUser)
    //         if (authUser) {
    //             // User is signed in, set the user in the context
    //             const { photoURL, displayName } = authUser;
    //             const accessToken = authUser.getIdToken(); // Get the access token from the user object
    //             const photoURLWithToken = `${photoURL}?access_token=${accessToken}`;

    //             dispatch({
    //                 type: "SET_USER",
    //                 user: {
    //                     displayName,
    //                     photoURL: photoURLWithToken
    //                 }
    //             })
    //         } else {
    //             // No user is signed in, set the user to null or an initial state
    //             dispatch({
    //                 type: "SET_USER",
    //                 user: null,
    //             });
    //         }

    //         // Authentication state check is complete, stop loading
    //         setIsLoading(false);
    //     });

    //     return () => {
    //         unsubscribe(); // Unsubscribe when the component unmounts
    //     };
    // }, []);

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


    // // Render a loading indicator while authentication state is being checked
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
