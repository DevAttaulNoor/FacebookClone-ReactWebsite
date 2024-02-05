import '../../CSS/HomePage/HomePage_Feeds.css'
import React, { useEffect, useState } from 'react'
import { db } from '../BackendRelated/Firebase'
import HomePage_Feeds_StoryReels from './HomePage_Feeds_StoryReels'
import HomePage_Feeds_Posts from './HomePage_Feeds_Posts'
import HomePage_Feeds_Posting from './HomePage_Feeds_Posting'
import Skeleton_Post from '../Skeletons/Skeleton_Post'

function HomePage_Feeds() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = db.collection("Posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const filteredPosts = snapshot.docs
                    .filter(doc => !doc.data().dob)
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setPosts(filteredPosts);
                setLoading(false);
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
        <div className='homepage_Feeds'>
            <HomePage_Feeds_StoryReels />
            <HomePage_Feeds_Posting />

            {loading ? (
                <div className='postSkeleton'>
                    <Skeleton_Post />
                    <Skeleton_Post />
                </div>
            ) : (
                <>
                    {posts.map(post => {
                        const formattedDate = timeAgo(post.data.timestamp);
                        return (
                            <HomePage_Feeds_Posts
                                id={post.id}
                                userid={post.data.uid}
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
                </>
            )}
        </div>
    );
}

export default HomePage_Feeds;