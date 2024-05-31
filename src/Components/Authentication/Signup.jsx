import '../../CSS/Authentication/Signup.css'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Redux/userSlice';
import { setAuthForm } from '../../Redux/authSlice';
import { auth, db, storage } from '../../Firebase/firebase';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDOB] = useState(new Date());
    const [selectedGender, setSelectedGender] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [isSignupProcessing, setIsSignupProcessing] = useState(false);
    const [signuperror, setSignupError] = useState(null);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = Array.from({ length: 100 }, (_, i) => new Date().getUTCFullYear() - i);

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

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSignupProcessing(true);
        setSignupError(null);

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(
                email,
                password
            );

            const user = userCredential.user;
            const uid = user.uid;

            let photoURL = null;
            if (profilePicture) {
                const storageRef = storage.ref(`Users/${userCredential.user.uid}/${profilePicture.name}`);
                await storageRef.put(profilePicture);
                const downloadURL = await storageRef.getDownloadURL();
                photoURL = downloadURL;
            }

            let coverphotoUrl = null;
            if (coverPicture) {
                const storageRef = storage.ref(`Users/${userCredential.user.uid}/${coverPicture.name}`);
                await storageRef.put(coverPicture);
                const downloadURL = await storageRef.getDownloadURL();
                coverphotoUrl = downloadURL;
            }

            await userCredential.user.updateProfile({
                displayName: `${firstname} ${lastname}`,
                photoURL: photoURL,
            });


            await db.collection("Users").doc(uid).set({
                uid: user.uid,
                email: user.email,
                password: password,
                username: user.displayName,
                dob: Math.floor(dob.getTime() / 1000),
                gender: selectedGender,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl,
            });

            // Create a post data object
            const postData = {
                uid: user.uid,
                email: user.email,
                dob: Math.floor(dob.getTime() / 1000),
                username: user.displayName,
                photoURL: user.photoURL,
            };

            // Save the post data to Firestore
            await db.collection("Posts").add(postData);

            const userData = {
                uid: uid,
                email: email,
                password: password,
                username: `${firstname} ${lastname}`,
                dob: Math.floor(dob.getTime() / 1000),
                gender: selectedGender,
                photoURL: photoURL,
                coverphotoUrl: coverphotoUrl,
            };

            sessionStorage.setItem('userData', JSON.stringify(userData));
            dispatch(loginUser(userData));
            navigate('homepage/');
        }

        catch (error) {
            console.error('Signup Error:', error.message);
            setSignupError("Sign up error. Try again");
        }

        finally {
            setIsSignupProcessing(false);
        }
    };

    return (
        <div className='signup'>
            <div className="signupTop">
                <h1>Create a new account</h1>
                <p>It's quick and easy.</p>
            </div>

            <form className='signupMiddle' onSubmit={handleSignup}>
                <div className="nameContainer">
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

                <div className="emailContainer">
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
                        placeholder="New password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="dobContainer">
                    <h5>Date of birth</h5>

                    <div className="dobOptions">
                        <div className="dobOption">
                            <select value={dob.getDate()} onChange={(e) => setDOB(new Date(dob.setUTCDate(e.target.value)))}>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="dobOption">
                            <select value={monthNames[dob.getMonth()]} onChange={(e) => {
                                const monthIndex = monthNames.indexOf(e.target.value);
                                setDOB(new Date(dob.setUTCMonth(monthIndex)));
                            }}>
                                {monthNames.map((monthName) => (
                                    <option key={monthName} value={monthName}>
                                        {monthName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="dobOption">
                            <select value={dob.getFullYear()} onChange={(e) => setDOB(new Date(dob.setUTCFullYear(e.target.value)))}>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="genderContainer">
                    <h5>Gender</h5>

                    <div className="genderOptions">
                        <div className={`genderOption ${selectedGender === 'Male' ? 'active' : ''}`} onClick={() => setSelectedGender('Male')}>
                            <p>Male</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Male' ? 'active' : ''}`} />
                        </div>

                        <div className={`genderOption ${selectedGender === 'Female' ? 'active' : ''}`} onClick={() => setSelectedGender('Female')}>
                            <p>Female</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Female' ? 'active' : ''}`} />
                        </div>

                        <div className={`genderOption ${selectedGender === 'Other' ? 'active' : ''}`} onClick={() => setSelectedGender('Other')}>
                            <p>Other</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Other' ? 'active' : ''}`} />
                        </div>
                    </div>
                </div>

                <div className='profilePicContainer'>
                    <button type="button" className='picturesBtn' onClick={() => document.getElementById("profilePictureInput").click()}>Choose Profile Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="profilePictureInput"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureChange}
                    />

                    {selectedProfileImage && (
                        <img src={selectedProfileImage} alt="profilePicture" />
                    )}
                </div>

                <div className='coverPicContainer'>
                    <button type="button" className='picturesBtn' onClick={() => document.getElementById("coverPictureInput").click()}>Choose Cover Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="coverPictureInput"
                        style={{ display: "none" }}
                        onChange={handleCoverPictureChange}
                    />

                    {selectedCoverImage && (
                        <img src={selectedCoverImage} alt="coverPicture" />
                    )}
                </div>

                <div className='notesContainer'>
                    <p id='learnMoreNote'>People who use our service may have uploaded your contact information to Facebook. <span>Learn more</span>.</p>
                    <p id="termCondNote">By clicking Sign Up, you agree to our <span>Terms</span>, <span>Privacy Policy</span> and <span>Cookies Policy</span>. You may receive SMS notifications from us and can opt out at any time.</p>
                </div>

                <button id='submitBtn' type="submit">{isSignupProcessing ? <div className="loadingSpin"></div> : 'Sign Up'}</button>
                {signuperror && <p className="errorNote">{signuperror}</p>}
                <button id='switchFormBtn' onClick={() => dispatch(setAuthForm('login'))}>Already have an account?</button>
            </form>
        </div>
    )
}

export default Signup;