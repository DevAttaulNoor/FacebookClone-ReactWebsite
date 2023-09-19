import "../CSS/Login.css";
import React, { useEffect, useState } from 'react';
import { auth, db, provider, storage } from './Firebase';
import { useStateValue } from './StateProvider'
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import Modal from 'react-modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {
    Modal.setAppElement('#root');

    const [{ }, dispatch] = useStateValue();
    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to track password visibility
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);
    const [isSignupProcessing, setIsSignupProcessing] = useState(false);

    const navigate = useNavigate();

    if (isUserLoggedOut === 'true') {
        sessionStorage.removeItem('userLoggedOut');
    }

    const signInWithFacebook = () => {
        auth.signInWithPopup(provider).then((result) => {
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
            navigate('/home');
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
        setIsLoginProcessing(true); // Start loading

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

                navigate('/home');
            } else {
                console.error('User data not found in Firestore');
            }
        } catch (error) {
            console.error('Sign-In Error:', error.message);
        } finally {
            setIsLoginProcessing(false); // Stop loading
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
        setIsSignupProcessing(true); // Start loading

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(
                emailSignUp,
                passwordSignUp
            );

            const user = userCredential.user;
            const uid = user.uid;

            let photoURL = null;
            if (profilePicture) {
                const storageRef = storage.ref(`Images/Users/ProfileImage/${userCredential.user.uid}/${profilePicture.name}`);
                await storageRef.put(profilePicture);
                const downloadURL = await storageRef.getDownloadURL();
                photoURL = downloadURL;
            }

            let coverphotoUrl = null;
            if (coverPicture) {
                const storageRef = storage.ref(`Images/Users/CoverImage/${userCredential.user.uid}/${coverPicture.name}`);
                await storageRef.put(coverPicture);
                const downloadURL = await storageRef.getDownloadURL();
                coverphotoUrl = downloadURL;
            }

            await userCredential.user.updateProfile({
                displayName: username,
                photoURL: photoURL,
            });

            db.collection("Users").doc(uid).set({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl
            });

            const userData = {
                uid: uid,
                email: emailSignUp,
                displayName: username,
                photoURL: photoURL,
                coverphotoUrl: coverphotoUrl
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            dispatch({
                type: "SET_USER",
                user: userData,
            });

            navigate('/home');
        }

        catch (error) {
            console.error('Signup Error:', error.message);
        }
        finally {
            setIsSignupProcessing(false); // Stop loading
        }
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const handleCoverPictureChange = (e) => {
        if (e.target.files[0]) {
            setCoverPicture(e.target.files[0]);
        }
    };

    const openSignupModal = () => {
        setIsSignupModalOpen(true);
    };

    const closeSignupModal = () => {
        setIsSignupModalOpen(false);
    };

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    // Render a loading indicator while authentication state is being checked
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='login'>
            <div className="loginIntro">
                <h1>facebook</h1>
                <p>Facebook helps you connect and share with the people in your life.</p>
            </div>

            <div className="loginForm">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    signInWithEmailAndPassword();
                }}>
                    <input
                        type="email"
                        value={emailSignIn}
                        placeholder="Email address"
                        onChange={(e) => setEmailSignIn(e.target.value)}
                        required
                    />
                    <div className="passwordContainer">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwordSignIn}
                            placeholder="Password"
                            onChange={(e) => setPasswordSignIn(e.target.value)}
                            required
                        />
                        <span className="passwordToggle" onClick={togglePasswordVisibility}>
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </span>
                    </div>
                    <button id="submitBtn" type="submit">
                        {isLoginProcessing ? 'Logging in...' : 'Log in'}
                    </button>

                    <button id="forgetBtn" type="button">Forgotten password?</button>
                    <hr id="line" />
                    <button id="newAccBtn" type="button" onClick={openSignupModal}>Create new account</button>
                </form>

                <div className="loginFB">
                    <button onClick={signInWithFacebook}>Log in</button>
                    <p>with existing FB account</p>
                </div>
            </div>

            <Modal className="newAccountModal" isOpen={isSignupModalOpen} onRequestClose={closeSignupModal}>
                <div className="newAccountIntro">
                    <h1>Sign Up</h1>
                    <p>It's quick and easy.</p>
                    <button onClick={closeSignupModal}>Close</button>
                </div>

                <hr id="line" />

                <div className="newAccountForm">
                    <form onSubmit={handleSignup}>
                        <div className="namesContainer">
                            <input
                                type="text"
                                value={username}
                                placeholder="First name"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {/* <input
                                type="text"
                                value={username}
                                placeholder="Surname"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            /> */}
                        </div>
                        <input
                            type="email"
                            value={emailSignUp}
                            placeholder="Email address"
                            onChange={(e) => setEmailSignUp(e.target.value)}
                            required
                        />
                        <div className="passwordContainer">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordSignUp}
                                placeholder="Password"
                                onChange={(e) => setPasswordSignUp(e.target.value)}
                                required
                            />
                            <span className="passwordToggle" onClick={togglePasswordVisibility}>
                                {showPassword ? (
                                    <VisibilityIcon />
                                ) : (
                                    <VisibilityOffIcon />
                                )}
                            </span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Display photo"
                            onChange={handleProfilePictureChange}
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Cover photo"
                            onChange={handleCoverPictureChange}
                            required
                        />
                        <p id="terms">By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.</p>
                        <button type="submit">
                            {isSignupProcessing ? 'Signing up...' : 'Create new account'}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default Login;