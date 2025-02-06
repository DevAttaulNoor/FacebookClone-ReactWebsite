import '../../CSS/Authentication/Login.css'
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/userSlice';
import { setAuthForm } from '../../Redux/authSlice';
import { auth, db } from '../../Firebase/firebase';

function Login() {
    Modal.setAppElement('#root');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginerror, setLoginError] = useState(null);
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);

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

                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
                dispatch(loginUser(updatedUserData));
                navigate('homepage/');
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

    return (
        <form className='login' onSubmit={(e) => {
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
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" id="submitBtn">{isLoginProcessing ? <div className="loadingSpin"></div> : 'Log in'}</button>
            {loginerror && <p className="errorNote">{loginerror}</p>}
            <button type="button" id="forgetBtn">Forgotten password?</button>
            <hr id="line" />
            <button type="button" id="newAccBtn" onClick={() => dispatch(setAuthForm('signup'))}>Create new account</button>
        </form>
    )
}

export default Login;