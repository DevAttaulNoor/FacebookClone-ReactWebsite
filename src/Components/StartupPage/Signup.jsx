import '../../CSS/StartupPage/Signup.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup(props) {
    const [{ user }, dispatch] = useStateValue();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignupProcessing, setIsSignupProcessing] = useState(false);
    const [signuperror, setSignupError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSignupProcessing(true);
        setSignupError(null);

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
                displayName: `${firstname} ${lastname}`,
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
                firstname: firstname,
                lastname: lastname,
                photoURL: photoURL,
                coverphotoUrl: coverphotoUrl
            };

            sessionStorage.setItem('userData', JSON.stringify(userData));

            dispatch({
                type: "SET_USER",
                user: userData,
            });

            navigate('/homepage');
        }

        catch (error) {
            console.error('Signup Error:', error.message);
            setSignupError("Sign up error. Try again");
        }

        finally {
            setIsSignupProcessing(false);
        }
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files[0]) {
            setSelectedProfileImage(URL.createObjectURL(e.target.files[0]));
            setProfilePicture(e.target.files[0]);
        }
    };

    const handleCoverPictureChange = (e) => {
        if (e.target.files[0]) {
            setSelectedCoverImage(URL.createObjectURL(e.target.files[0]));
            setCoverPicture(e.target.files[0]);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className='signup'>
            <div className="signupModal_Top">
                <h1>Sign Up</h1>
                <p>It's quick and easy.</p>
                <CloseIcon onClick={props.closeSignupModal}/>
            </div>

            <hr id="line" />

            <div className="signupModal_Middle">
                <form onSubmit={handleSignup}>
                    <div className="namesContainer">
                        <input
                            type="text"
                            value={firstname}
                            placeholder="First name"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            value={lastname}
                            placeholder="Last name"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
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

                    <button className='picturesBtn' onClick={() => document.getElementById("profilePictureInput").click()}>Choose Profile Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="profilePictureInput"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureChange}
                        required
                    />

                    {selectedProfileImage && (
                        <img src={selectedProfileImage} alt="Selected Profile Picture" />
                    )}

                    <button className='picturesBtn' onClick={() => document.getElementById("coverPictureInput").click()}>Choose Cover Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="coverPictureInput"
                        style={{ display: "none" }}
                        onChange={handleCoverPictureChange}
                        required
                    />

                    {selectedCoverImage && (
                        <img src={selectedCoverImage} alt="Selected Cover Picture" />
                    )}

                    <p id="termsAndCond">By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.</p>

                    <button id='submitBtn' type="submit">
                        {isSignupProcessing ? <div class="loadingSpin"></div> : 'Create new account'}
                    </button>

                    {signuperror && <p className="errorNote">{signuperror}</p>}
                </form>
            </div>
        </div >
    )
}

export default Signup