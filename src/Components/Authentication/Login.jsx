import '../../CSS/Authentication/Login.css'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/userSlice';
import { setAuthForm } from '../../Redux/authSlice';
import { auth, db, provider } from '../../Firebase/firebase';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {
    Modal.setAppElement('#root');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginerror, setLoginError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);

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

            db.collection("Users").doc(uid).set({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl
            });

            dispatch(loginUser(userData));
            sessionStorage.setItem('userData', JSON.stringify(userData));
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
                email,
                password
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
                    email: email,
                    password: userData.password,
                    username: userData.username,
                    dob: userData.dob,
                    gender: userData.gender,
                    photoURL: userData.photoURL,
                    coverphotoUrl: userData.coverphotoUrl
                };

                dispatch(loginUser(updatedUserData))
                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
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

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            // If user data is found in session storage, parse it and set it in the context
            const userData = JSON.parse(storedUserData);
            dispatch(loginUser(userData));
            navigate('/homepage')
        }
    }, []);

    return (
        <div className='login'>
            <form className='loginTop' onSubmit={(e) => {
                e.preventDefault();
                signInWithEmailAndPassword();
            }}>
                <div className='emailContainer'>
                    <input
                        type="email"
                        value={email}
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="passwordContainer">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
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

                <button type="submit" id="submitBtn">{isLoginProcessing ? <div class="loadingSpin"></div> : 'Log in'}</button>
                {loginerror && <p className="errorNote">{loginerror}</p>}
                <button id="forgetBtn" type="button">Forgotten password?</button>
                <hr id="line" />
                <button id="newAccBtn" type="button" onClick={() => dispatch(setAuthForm('signup'))}>Create new account</button>
            </form>

            <div className='loginBottom'>
                <button onClick={signInWithFacebook}>Log in</button>
                <p>with existing FB account</p>
            </div>
        </div>
    )
}

export default Login;