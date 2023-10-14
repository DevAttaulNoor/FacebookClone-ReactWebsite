import "../../CSS/UserPage/UserPage.css";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../BackendRelated/StateProvider";
import { db, storage } from "../BackendRelated/Firebase";
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import UserPage_Feed from "./UserPage_Feed";
import UserPage_Info from "./UserPage_Info";
import UserPage_Friends from "./UserPage_Friends";
import UserPage_Photos from "./UserPage_Photos";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function UserPage() {
    const [{ user }, dispatch] = useStateValue();
    const [friends, setFriends] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [activeOption, setActiveOption] = useState("Posts");

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
            const storageRef = storage.ref(`Images/Users/ProfileImage/${user.uid}/${file.name}`);

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
            const storageRef = storage.ref(`Images/Users/CoverImage/${user.uid}/${coverfile.name}`);

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

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    return (
        <div className="userpage">
            <div className="userpage_Top">
                <div className="userpage_TopCoverSection">
                    <img src={user.coverphotoUrl} alt="Cover" />
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
                            <h3>{`${user.firstname} ${user.lastname}`}</h3>
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
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'Posts' ? 'active' : ''}`} onClick={() => handleOptionClick('Posts')}>Posts</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'About' ? 'active' : ''}`} onClick={() => handleOptionClick('About')}>About</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'Friends' ? 'active' : ''}`} onClick={() => handleOptionClick('Friends')}>Friends</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'Photos' ? 'active' : ''}`} onClick={() => handleOptionClick('Photos')}>Photo</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'Videos' ? 'active' : ''}`} onClick={() => handleOptionClick('Videos')}>Videos</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'Check-ins' ? 'active' : ''}`} onClick={() => handleOptionClick('Check-ins')}>Check-ins</div>
                        <div className={`userpage_TopComponents_LeftOption ${activeOption === 'More' ? 'active' : ''}`} onClick={() => handleOptionClick('More')}>More</div>
                    </div>
                    <div className="userpage_TopComponents_Right">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="userpage_Bottom">
                <div className="userpage_BottomLeft">
                    <div className="userIntro">
                        <UserPage_Info />
                    </div>
                    <div className="userPhotos">
                        <UserPage_Photos />
                    </div>
                    <div className="userFriends">
                        <UserPage_Friends />
                    </div>
                </div>
                <div className="userpage_BottomRight">
                    <div className="userFeed">
                        <UserPage_Feed />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;