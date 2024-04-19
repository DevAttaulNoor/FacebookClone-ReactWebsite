import "../../CSS/UserPage/UserPage_Videos.css";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import firebase from "firebase/compat/app";

function UserPage_Videos() {
    const user = useSelector((state) => state.data.user.user);
    const [videoUrls, setVideoUrls] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const urls = [];
            const storageRef = firebase.storage().ref(`Posts/${user.uid}`);

            try {
                const result = await storageRef.listAll();
                const videoItems = result.items.filter(itemRef => itemRef.name.endsWith('.mp4'));
                const urlsForVideos = await Promise.all(videoItems.map(itemRef => itemRef.getDownloadURL()));
                urls.push(...urlsForVideos);
            } 
            
            catch (error) {
                console.error("Error fetching Videos:", error);
            }
            setVideoUrls(urls);
        };
        fetchVideos();
    }, [user]);

    return (
        <div className='userpageVideos'>
            <div className="userpageVideos_Top">
                <h3>Videos</h3>
                <NavLink to="/userhomepage/video" activeclassname="active">
                    See all videos
                </NavLink>
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

export default UserPage_Videos;
