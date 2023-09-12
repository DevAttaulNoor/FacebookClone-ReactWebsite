import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, provider, storage } from './Firebase';
import { useStateValue } from './StateProvider'
import fblogo from '../Imgs/fblogo.png';
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom';


function Login() {
    const [{ }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(true);
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
    const navigate = useNavigate();

    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');

    if (isUserLoggedOut === 'true') {
        sessionStorage.removeItem('userLoggedOut');
    }

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log(result)
                const userCredential = result;
                const user = userCredential.user; 
                const uid = user.uid; 
                const email = user.email;
                const displayName = user.displayName;
                const photoURL = `${user.photoURL}?access_token=${userCredential.credential.accessToken}`;

                const userData = {
                    uid: uid,
                    email: email,
                    displayName: displayName,
                    photoURL: photoURL
                };
                sessionStorage.setItem('userData', JSON.stringify(userData));

                dispatch({
                    type: "SET_USER",
                    user: userData
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
            const displayName = user.displayName;
            const photoURL = user.photoURL;

            const userData = {
                uid: uid,
                email: emailSignIn,
                displayName: displayName,
                photoURL: photoURL
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            dispatch({
                type: "SET_USER",
                user: userData
            });
            navigate('/');

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

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Create a new user with email and password
            const userCredential = await auth.createUserWithEmailAndPassword(
                emailSignUp,
                passwordSignUp
            );

            const user = userCredential.user; // User object
            const uid = user.uid; // User UID

            // Step 2: Upload profile picture to Firebase Storage
            let photoURL = null;
            if (profilePicture) {
                const storageRef = storage.ref(`profile-pictures/${userCredential.user.uid}`);
                await storageRef.put(profilePicture);
                const downloadURL = await storageRef.getDownloadURL();
                photoURL = downloadURL;
            }

            // Step 3: Set username and profile picture in user's profile
            await userCredential.user.updateProfile({
                displayName: username,
                photoURL: photoURL,
            });

            // Save user data in session storage
            const userData = {
                uid: uid, // Add User UID
                email: emailSignUp,
                displayName: username,
                photoURL: photoURL,
            };

            // Store the user data in session storage
            sessionStorage.setItem('userData', JSON.stringify(userData));

            dispatch({
                type: "SET_USER",
                user: userData,
            });

            // Redirect the user to the home page after successful login
            navigate('/');

            // User successfully signed up
            console.log('User signed up:', userCredential.user);
        } catch (error) {
            // Handle signup error
            console.error('Signup Error:', error.message);
        }
    };


    const handleProfilePictureChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

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

            <div>
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={emailSignUp}
                        onChange={(e) => setEmailSignUp(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={passwordSignUp}
                        onChange={(e) => setPasswordSignUp(e.target.value)}
                        required
                    />
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                    />
                    <button type="submit">Sign Up</button>
                </form>
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

