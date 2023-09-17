import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, db, provider } from './Firebase';
import { useStateValue } from './StateProvider'
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import fblogo from '../Imgs/fblogo.png';

function Login() {
    const [{ }, dispatch] = useStateValue();
    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
    const navigate = useNavigate();

    if (isUserLoggedOut === 'true') {
        sessionStorage.removeItem('userLoggedOut');
    }

    const signInWithFacebook = () => {
        auth.signInWithPopup(provider).then((result) => {
            // console.log(result)
            const userCredential = result;
            const user = userCredential.user;
            const uid = user.uid;
            const email = user.email;
            const displayName = user.displayName;
            const photoURL = `${user.photoURL}?access_token=${userCredential.credential.accessToken}`;
            const coverphotoUrl = ''

            const userData = {
                uid: uid,
                email: email,
                displayName: displayName,
                photoURL: photoURL,
                coverphotoUrl: coverphotoUrl
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            dispatch({
                type: "SET_USER",
                user: userData
            });


            db.collection("Users").doc(uid).set({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl
            });
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

    const signInWithEmailAndPassword = async () => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(
                emailSignIn,
                passwordSignIn
            );
    
            const user = userCredential.user;
            const uid = user.uid;
    
            // Fetch user data from Firestore
            const userDoc = await db.collection('Users').doc(uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                // Update the user's profile information
                const updatedUserData = {
                    uid: uid,
                    email: emailSignIn,
                    displayName: userData.username,
                    photoURL: userData.photoURL,
                    coverphotoUrl: userData.coverphotoUrl
                };
                
                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
    
                dispatch({
                    type: "SET_USER",
                    user: updatedUserData
                });
                
                navigate('/');
            } else {
                console.error('User data not found in Firestore');
            }
        } catch (error) {
            console.error('Sign-In Error:', error.message);
        }
    };
    
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
                <button onClick={signInWithFacebook}>Login with Facebook</button>
            </div>

            <h2>Log In</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                signInWithEmailAndPassword();
            }}>
                <label>Email:</label>
                <input
                    type="email"
                    value={emailSignIn}
                    onChange={(e) => setEmailSignIn(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={passwordSignIn}
                    onChange={(e) => setPasswordSignIn(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login;

