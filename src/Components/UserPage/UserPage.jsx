import "../../CSS/UserPage/UserPage.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Blurhash } from 'react-blurhash';
import { NavLink } from 'react-router-dom'
import { loginUser } from "../../Redux/userSlice";
import { db, storage } from '../../Firebase/firebase';
import UserpageComponents from "./UserpageComponents";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function UserPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friends = useSelector((state) => state.data.friends.friends);
    const [imageLoaded, setImageLoaded] = useState(false);

    const changeProfileImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = storage.ref(`Users/${user.uid}/${file.name}`);

            storageRef.put(file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {

                    db.collection("Users").doc(user.uid).update({
                        photoURL: url
                    }).then(() => {
                        console.log("User's photoURL updated successfully!");

                        // Retrieve the existing userData from sessionStorage
                        const userDataString = sessionStorage.getItem('userData');
                        let userData = [];

                        if (userDataString) {
                            userData = JSON.parse(userDataString);
                        }

                        userData.photoURL = url;
                        dispatch(loginUser(userData))
                        sessionStorage.setItem('userData', JSON.stringify(userData));
                    }).catch((error) => {
                        console.error("Error updating user's photoURL: ", error);
                    });
                });
            });
        }
    };

    const changeCoverImage = (e) => {
        const coverfile = e.target.files[0];
        if (coverfile) {
            const storageRef = storage.ref(`Users/${user.uid}/${coverfile.name}`);

            storageRef.put(coverfile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {

                    db.collection("Users").doc(user.uid).update({
                        coverphotoUrl: url
                    }).then(() => {
                        console.log("User's coverphotoUrl updated successfully!");

                        // Retrieve the existing userData from sessionStorage
                        const userDataString = sessionStorage.getItem('userData');
                        let userData = [];

                        if (userDataString) {
                            userData = JSON.parse(userDataString);
                        }

                        userData.coverphotoUrl = url;
                        dispatch(loginUser(userData))
                        sessionStorage.setItem('userData', JSON.stringify(userData));

                    }).catch((error) => {
                        console.error("Error updating user's coverphotoUrl: ", error);
                    });
                });
            });
        }
    }

    useEffect(() => {
        const img = new Image();
        img.src = user.coverphotoUrl;
        img.onload = () => {
            setImageLoaded(true);
        };
    }, [user.coverphotoUrl]);

    return (
        <div className="userpage">
            <div className="userpageTop">
                <div className="userpageTop_CoverSection">
                    {imageLoaded ? (
                        <img
                            src={user.coverphotoUrl}
                            alt="Cover"
                        />
                    ) : (
                        <Blurhash
                            hash={"LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
                            width={995}
                            height={370}
                        />
                    )}
                    <button onClick={() => document.getElementById('coverImageInput').click()}>
                        <PhotoCameraIcon />
                        <p>Edit Cover Photo</p>
                    </button>
                    <input
                        type="file"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={changeCoverImage}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="userpageTop_ProfileSection">
                    <div className="userpageTop_ProfileSectionLeft">
                        <div className="userpageTop_ProfileSectionLeftPhoto">
                            <img src={user.photoURL} alt="profilePic" />
                            <div onClick={() => document.getElementById('profileImageInput').click()}>
                                <PhotoCameraIcon />
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={changeProfileImage}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="userpageTop_ProfileSectionLeftInfo">
                            <h3>{user.username}</h3>
                            <p>{friends.length} friends</p>
                        </div>
                    </div>

                    <div className="userpageTop_ProfileSectionRight">
                        <div className="userpageTop_ProfileSectionRightOption" id="addStoryBtn">
                            <AddIcon />
                            <p>Add to story</p>
                        </div>

                        <div className="userpageTop_ProfileSectionRightOption" id="editProfileBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" alt="" />
                            <p>Edit profile</p>
                        </div>

                        <div className="userpageTop_ProfileSectionRightOption" id="arrowBtn">
                            <KeyboardArrowDownIcon />
                        </div>
                    </div>
                </div>

                <div className="userpageTop_Components">
                    <div className="userpageTop_ComponentsLeft">
                        <NavLink to='/userhomepage/post' activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Posts</div>
                        </NavLink>

                        <NavLink to="/userhomepage/about" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>About</div>
                        </NavLink>

                        <NavLink to="/userhomepage/friend" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Friends</div>
                        </NavLink>

                        <NavLink to="/userhomepage/photo" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Photos</div>
                        </NavLink>

                        <NavLink to="/userhomepage/video" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Videos</div>
                        </NavLink>

                        <div className="userpageTop_ComponentsLeftOption" id="moreOption">
                            <p>More</p>
                            <ArrowDropDownIcon />
                        </div>
                    </div>

                    <div className="userpageTop_ComponentsRight">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="userpageBottom">
                <UserpageComponents />
            </div>
        </div>
    );
}

export default UserPage;