import '../../CSS/StartupPage/Signup.css'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Redux/userSlice';
import { auth, db, storage } from '../../Firebase/firebase';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';

function Signup(props) {
    const dispatch = useDispatch();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                dob: dob,
                gender: selectedGender,
                photoURL: user.photoURL,
                coverphotoUrl: coverphotoUrl,
            });

            // Create a post data object
            const postData = {
                uid: user.uid,
                email: user.email,
                dob: dob,
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
                dob: dob,
                gender: selectedGender,
                photoURL: photoURL,
                coverphotoUrl: coverphotoUrl,
            };

            dispatch(loginUser(userData));
            sessionStorage.setItem('userData', JSON.stringify(userData));
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

    const handleGenderClick = (gender) => {
        setSelectedGender(gender);
    };

    return (
        <div className='signup'>
            <div className="signupModal_Top">
                <h1>Sign Up</h1>
                <p>It's quick and easy.</p>
                <CloseIcon onClick={props.closeSignupModal} />
            </div>

            <hr id="line" />

            <div className="signupModal_Middle">
                <form onSubmit={handleSignup}>
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
                            type={showPassword ? "text" : "password"}
                            value={password}
                            placeholder="New password"
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

                    <div className="dobContainer">
                        <p id='dobContainerTitle'>Date of birth</p>
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
                        <p id='genderContainerTitle'>Gender</p>
                        <div className="genderOptions">
                            <div className={`genderOption ${selectedGender === 'Male' ? 'active' : ''}`} onClick={() => handleGenderClick('Male')}>
                                <p>Male</p>
                                <AdjustOutlinedIcon className={`${selectedGender === 'Male' ? 'active' : ''}`} />
                            </div>

                            <div className={`genderOption ${selectedGender === 'Female' ? 'active' : ''}`} onClick={() => handleGenderClick('Female')}>
                                <p>Female</p>
                                <AdjustOutlinedIcon className={`${selectedGender === 'Female' ? 'active' : ''}`} />
                            </div>

                            <div className={`genderOption ${selectedGender === 'Other' ? 'active' : ''}`} onClick={() => handleGenderClick('Other')}>
                                <p>Other</p>
                                <AdjustOutlinedIcon className={`${selectedGender === 'Other' ? 'active' : ''}`} />
                            </div>
                        </div>
                    </div>

                    <div className='profilePicContainer'>
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
                    </div>

                    <div className='coverPicContainer'>
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
                    </div>

                    <div className='notesContainer'>
                        <p id='learnMoreNote'>People who use our service may have uploaded your contact information to Facebook. <span>Learn more</span>.</p>
                        <p id="termCondNote">By clicking Sign Up, you agree to our <span>Terms</span>, <span>Privacy Policy</span> and <span>Cookies Policy</span>. You may receive SMS notifications from us and can opt out at any time.</p>
                    </div>

                    <button id='submitBtn' type="submit">{isSignupProcessing ? <div class="loadingSpin"></div> : 'Create new account'}</button>
                    {signuperror && <p className="errorNote">{signuperror}</p>}
                </form>
            </div>
        </div>
    )
}

export default Signup