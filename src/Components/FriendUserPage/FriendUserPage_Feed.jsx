import '../../CSS/FriendUserPage/FriendUserPage_Feed.css'
import React, { useEffect, useState } from 'react'
import { db } from '../BackendRelated/Firebase'
import { useParams } from 'react-router-dom';
import HomePage_Feeds_Posting from '../HomePage/HomePage_Feeds_Posting'
import HomePage_Feeds_Posts from '../HomePage/HomePage_Feeds_Posts'

function FriendUserPage_Feed() {
    const { friendUid } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("Posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            const filteredPosts = snapshot.docs
                .filter(doc => doc.data().uid === friendUid)
                .map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }));

            setPosts(filteredPosts);
        });
        return () => unsubscribe();
    }, [friendUid]);

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
        <div className='frienduserpage_Feed'>
            <HomePage_Feeds_Posting />
            {
                posts.map(post => {
                    const formattedDate = timeAgo(post.data.timestamp);
                    return (
                        <HomePage_Feeds_Posts
                            id={post.id}
                            photoURL={post.data.photoURL}
                            image={post.data.image}
                            username={post.data.username}
                            timestamp={formattedDate}
                            message={post.data.message}
                            key={post.id}
                        />
                    );
                })
            }
        </div>
    )
}

export default FriendUserPage_Feed