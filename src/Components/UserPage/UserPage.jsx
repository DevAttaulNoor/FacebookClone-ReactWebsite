import "../../CSS/UserPage/UserPage.css";
import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'
import { useStateValue } from "../BackendRelated/StateProvider";
import { db, storage } from "../BackendRelated/Firebase";
import { Blurhash } from 'react-blurhash';
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import UserPage_Components from "./UserPage_Components";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function UserPage() {
    const [{ user }, dispatch] = useStateValue();
    const [friends, setFriends] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = user.coverphotoUrl;
        img.onload = () => {
            setImageLoaded(true);
        };
    }, [user.coverphotoUrl]);

    useEffect(() => {
        fetchFriendsData(user.uid, setFriends);
    }, [user.uid]);

    useEffect(() => {
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    const changeProfileImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
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
                        sessionStorage.setItem('userData', JSON.stringify(userData));

                        // Update the user object in state with the new photoURL
                        dispatch({
                            type: "SET_USER",
                            user: {
                                ...user,
                                photoURL: url,
                            },
                        });

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
            setCoverImage(coverfile);
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
                        sessionStorage.setItem('userData', JSON.stringify(userData));

                        // Update the user object in state with the new photoURL
                        dispatch({
                            type: "SET_USER",
                            user: {
                                ...user,
                                coverphotoUrl: url,
                            },
                        });

                    }).catch((error) => {
                        console.error("Error updating user's coverphotoUrl: ", error);
                    });
                });
            });
        }
    }

    return (
        <div className="userpage">
            <div className="userpage_Top">
                <div className="userpage_TopCoverSection">
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

                <div className="userpage_TopProfileSection">
                    <div className="userpage_TopProfileSection_Left">
                        <div className="userpage_TopProfileSection_LeftPhoto">
                            <img src={user.photoURL} alt="Profile" />
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

                        <div className="userpage_TopProfileSection_LeftInfo">
                            <h3>{user.username}</h3>
                            <p>{friends.length} friends</p>
                        </div>
                    </div>

                    <div className="userpage_TopProfileSection_Right">
                        <div className="userpage_TopProfileSection_RightOption" id="addStoryBtn">
                            <AddIcon />
                            <p>Add to story</p>
                        </div>

                        <div className="userpage_TopProfileSection_RightOption" id="editProfileBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" alt="" />
                            <p>Edit profile</p>
                        </div>

                        <div className="userpage_TopProfileSection_RightOption" id="arrowBtn">
                            <KeyboardArrowDownIcon />
                        </div>
                    </div>
                </div>

                <div className="userpage_TopComponents">
                    <div className="userpage_TopComponents_Left">
                        <NavLink to='/userhomepage/post' activeClassName="active">
                            <div className='userpage_TopComponents_LeftOption'>Posts</div>
                        </NavLink>

                        <NavLink to="/userhomepage/about" activeClassName="active">
                            <div className='userpage_TopComponents_LeftOption'>About</div>
                        </NavLink>

                        <NavLink to="/userhomepage/friend" activeClassName="active">
                            <div className='userpage_TopComponents_LeftOption'>Friends</div>
                        </NavLink>

                        <NavLink to="/userhomepage/photo" activeClassName="active">
                            <div className='userpage_TopComponents_LeftOption'>Photos</div>
                        </NavLink>

                        <NavLink to="/userhomepage/video" activeClassName="active">
                            <div className='userpage_TopComponents_LeftOption'>Videos</div>
                        </NavLink>

                        <div className="userpage_TopComponents_LeftOption" id="moreOption">
                            <p>More</p>
                            <ArrowDropDownIcon />
                        </div>
                    </div>

                    <div className="userpage_TopComponents_Right">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="userpage_Bottom">
                <UserPage_Components />
            </div>
        </div>
    );
}

export default UserPage;