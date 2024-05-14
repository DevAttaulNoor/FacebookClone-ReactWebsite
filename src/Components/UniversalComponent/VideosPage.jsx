import '../../CSS/UniversalComponent/VideosPage.css'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { db } from '../../Firebase/firebase';
import Post from '../Post/Post';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

function VideosPage() {
    const [posts, setPosts] = useState([]);

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

    return (
        <div className='videospage'>
            <div className='videosageLeftbar'>
                <div className="videosageLeftbarTop">
                    <p>Video</p>
                    <SettingsIcon />
                </div>

                <div className="videosageLeftbarBottom">
                    <NavLink to="/videospage/" activeclassname="active">
                        <div className="videosageLeftbarBottomOptions">
                            <div className="videosageLeftbarBottomOption">
                                <SmartDisplayIcon />
                                <p>Home</p>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='videospageMain'>
                {posts.map(post => {
                    const formattedDate = timeAgo(post.data.timestamp);
                    return (
                        <Post
                            id={post.id}
                            userid={post.data.uid}
                            username={post.data.username}
                            photoURL={post.data.photoURL}
                            message={post.data.message}
                            media={post.data.media}
                            mediaType={post.data.mediaType}
                            timestamp={formattedDate}
                            key={post.id}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default VideosPage