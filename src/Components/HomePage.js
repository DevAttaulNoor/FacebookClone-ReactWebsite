import "../CSS/HomePage.css";
import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import cover from "../Imgs/Cover.jpg";
import HomePageIntro from "./HomePageIntro";
import HomePagePhotos from "./HomePagePhotos";
import HomePageFriends from "./HomePageFriends";
import HomePageFeed from "./HomePageFeed";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { db, storage } from './Firebase';

function HomePage() {
    const [{ user }, dispatch] = useStateValue();
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

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

    return (
        <div className="userHomePage">
            <div className="coverPhotoSection">
                <img src={user.coverphotoUrl} alt="Cover" />
                <button>Create with avatar</button>

            </div>

            <div className="profileSection">
                <div className="profileSections">
                    <div className="profileSections_left">
                        <div className="profileSections_left_left">
                            <img src={user.photoURL} alt="Profile" />
                            <label htmlFor="profileImageInput">
                                <PhotoCameraIcon />
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={changeProfileImage}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                        <div className="profileSections_left_right">
                            <h1>{user.displayName}</h1>
                            <h4>{0} friends</h4>
                        </div>
                    </div>
                    <div className="proflieSections_right">
                        <button>Add to story</button>
                        <button>Edit profile</button>
                        <button>Arrow</button>
                        <label htmlFor="coverImageInput" className="coverPhoto">
                            <button onClick={() => document.getElementById('coverImageInput').click()}>Edit cover photo</button>
                            <input
                                type="file"
                                id="coverImageInput"
                                accept="image/*"
                                onChange={changeCoverImage}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                </div>

                <div className="userComponents">
                    <div className="userComponent_left">
                        <div className="component active">Posts</div>
                        <div className="component">About</div>
                        <div className="component">Friends</div>
                        <div className="component">Photos</div>
                        <div className="component">Videos</div>
                        <div className="component">Check-ins</div>
                        <div className="component">More</div>
                    </div>
                    <div className="userComponent_right">
                        <div>
                            <button>Arrow</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="userHomePage_bottom">
                <div className="userHomePage_bottom_left">
                    <div className="userIntro">
                        <HomePageIntro />
                    </div>
                    <div className="userPhotos">
                        <HomePagePhotos />
                    </div>
                    <div className="userFriends">
                        <HomePageFriends />
                    </div>
                </div>
                <div className="userHomePage_bottom_right">
                    <div className="userFeed">
                        <HomePageFeed />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
