import "../CSS/Signup.css";
import React, { useState } from 'react';
import { auth, db, storage } from './Firebase';
import { useStateValue } from './StateProvider'
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [{ }, dispatch] = useStateValue();
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

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

            db.collection("Users").doc(uid).set({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl
            });

            navigate('/');
            // console.log('User signed up:', userCredential.user);
        }

        catch (error) {
            console.error('Signup Error:', error.message);
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

    return (
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
                <label>Cover Picture:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPictureChange}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup