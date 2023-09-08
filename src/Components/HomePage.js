import "../CSS/HomePage.css";
import React from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import cover from "../Imgs/Cover.jpg";
import HomePageIntro from "./HomePageIntro";
import HomePagePhotos from "./HomePagePhotos";
import HomePageFriends from "./HomePageFriends";
import HomePageFeed from "./HomePageFeed";

function HomePage() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className="userHomePage">
            <div className="coverPhotoSection">
                <img src={cover} alt="Cover" />
                <button id="avatarBtn">Create with avatar</button>
                <button id="editBtn">Edit cover photo</button>
            </div>

            <div className="profileSection">
                <div className="profileSections">
                    <div className="profileSections_left">
                        <img src={user.photoURL} alt="Profile" />
                        <div className="profileSections_left_right">
                            <h1>{user.displayName}</h1>
                            <h4>{0} friends</h4>
                        </div>
                    </div>
                    <div className="proflieSections_right">
                        <button>Add to story</button>
                        <button>Edit profile</button>
                        <button>Arrow</button>
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
