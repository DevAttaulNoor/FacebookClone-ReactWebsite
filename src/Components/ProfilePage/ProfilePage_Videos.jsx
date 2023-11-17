import "../../CSS/UserPage/ProfilePage_Videos.css";
import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import { NavLink } from "react-router-dom";
import { useStateValue } from "../BackendRelated/StateProvider";

function ProfilePage_Videos() {
    const [{ user }] = useStateValue();
    const [videoUrls, setVideoUrls] = useState([]);

    useEffect(() => {
        // Fetch videos from the specified path
        const fetchVideos = async () => {
            const urls = [];
            const storageRef = firebase.storage().ref(`Posts/${user.uid}`);

            // List items (Videos) in the user's folder
            try {
                const result = await storageRef.listAll();

                // Filter items to include only videos (you can adjust the condition as needed)
                const videoItems = result.items.filter(itemRef => itemRef.name.endsWith('.mp4'));

                // Get download URLs for each video item
                const urlsForVideos = await Promise.all(
                    videoItems.map(itemRef => itemRef.getDownloadURL())
                );

                urls.push(...urlsForVideos);
            } catch (error) {
                console.error("Error fetching Videos:", error);
            }
            setVideoUrls(urls);
        };
        fetchVideos();
    }, [user]);

    return (
        <div className='userpageVideos'>
            <div className="userpageVideos_Top">
                <NavLink id="navLink" to="/userhomepage/video" activeClassName="active">
                    <h3>Videos</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all Videos</a>
            </div>

            <div className="userpageVideos_Bottom">
                <div className="userpageVideos_BottomContainer">
                    {videoUrls.map((url, index) => (
                        <video controls key={index}>
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage_Videos;
