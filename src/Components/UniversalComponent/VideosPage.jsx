import '../../CSS/UniversalComponent/VideosPage.css'


import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase/firebase';
import HomePage_Feeds_Posts from '../HomePage/HomepageFeedPosts';

import { NavLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

function VideosPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("Posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const filteredPosts = snapshot.docs
                    .filter(doc => !doc.data().dob) // Filter out posts with a "dob" attribute
                    .filter(doc => (doc.data().mediaType === 'video')) // Filter out posts with a "dob" attribute
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setPosts(filteredPosts);
            });
        return () => unsubscribe();
    }, []);

    const timeAgo = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0 second ago"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            decade: 315360000,
            year: 31536000,
            month: 2628000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        let elapsed = 0;
        let granularity = 0;
        let unit = '';

        for (const period in periods) {
            elapsed = Math.floor(secondsDifference / periods[period]);

            if (elapsed >= 1) {
                granularity = elapsed;
                unit = period;
                break;
            }
        }
        return `${granularity} ${unit}${granularity > 1 ? 's' : ''} ago`;
    };

    return (
        <div className='videosPage'>
            <div className='videosPageLeftbar'>
                <div className="videosPageLeftbar_Top">
                    <p>Video</p>
                    <SettingsIcon />
                </div>

                <div className="videosPageLeftbar_Bottom">
                    <NavLink to="/videospage/" activeclassname="active">
                        <div className="videosPageLeftbar_BottomOptions">
                            <div className="videosPageLeftbar_BottomOption">
                                <SmartDisplayIcon />
                                <p>Home</p>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='videosPageMain'>
                {posts.map(post => {
                    const formattedDate = timeAgo(post.data.timestamp);
                    return (
                        <HomePage_Feeds_Posts
                            id={post.id}
                            photoURL={post.data.photoURL}
                            media={post.data.media}
                            mediaType={post.data.mediaType}
                            username={post.data.username}
                            timestamp={formattedDate}
                            message={post.data.message}
                            key={post.id}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default VideosPage