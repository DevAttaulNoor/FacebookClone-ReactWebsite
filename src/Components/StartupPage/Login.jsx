import '../../CSS/StartupPage/Login.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, provider } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import Loading from "./Loading";
import Modal from 'react-modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Signup from './Signup';

function Login() {
    Modal.setAppElement('#root');

    const [{ }, dispatch] = useStateValue();
    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);
    const [loginerror, setLoginError] = useState(null);
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
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
            navigate('/homepage');
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
        setIsLoginProcessing(true);
        setLoginError(null);

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

                navigate('/homepage');
            }

            else {
                console.error('User data not found in Firestore');
            }
        }

        catch (error) {
            console.error('Sign-In Error:', error.message);
            setLoginError("Log in error. Try again");
        }

        finally {
            setIsLoginProcessing(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const openSignupModal = () => {
        setIsSignupModalOpen(true);
    };

    const closeSignupModal = () => {
        setIsSignupModalOpen(false);
    };

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
                    <button type="submit" id="submitBtn">
                        {isLoginProcessing ? <div class="loadingSpin"></div> : 'Log in'}
                    </button>
                    {loginerror && <p className="errorNote">{loginerror}</p>}

                    <button id="forgetBtn" type="button">Forgotten password?</button>
                    <hr id="line" />
                    <button id="newAccBtn" type="button" onClick={openSignupModal}>Create new account</button>
                </form>

                <div className="loginFB">
                    <button onClick={signInWithFacebook}>Log in</button>
                    <p>with existing FB account</p>
                </div>
            </div>

            <Modal className="signupModal" isOpen={isSignupModalOpen} onRequestClose={closeSignupModal}>
                <Signup closeSignupModal={closeSignupModal} />
            </Modal>
        </div>
    )
}

export default Login;