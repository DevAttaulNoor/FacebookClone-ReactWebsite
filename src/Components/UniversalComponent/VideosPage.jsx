import '../../CSS/UniversalComponent/VideosPage.css'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { db } from '../../Firebase/firebase';
import { timeAgo } from '../../Assets/Utility/TimeModule';
import PostFeed from '../PostPage/PostFeed';
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
                        <PostFeed
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