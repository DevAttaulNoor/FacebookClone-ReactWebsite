import '../../CSS/VideoPage/VideopageHome.css'
import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase/firebase';
import { timeAgo } from '../../Assets/Utility/TimeModule';
import PostFeed from '../PostPage/PostFeed';

function VideopageHome() {
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
        <div className='videopageHome'>
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
    )
}

export default VideopageHome