import '../CSS/Feeds.css'
import React, { useEffect, useState } from 'react'
import Storyreels from './Storyreels'
import MessageSender from './MessageSender'
import Posts from './Posts'
import { db } from './Firebase'

function Feeds() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("Posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            setPosts(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            );
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
        <div className='feeds'>
            <Storyreels />
            <MessageSender />
            {
                posts.map(post => {
                    const formattedDate = timeAgo(post.data.timestamp);
                    // {console.log("Feed timeago: ",formattedDate)}
                    return (
                        <Posts
                            id={post.id} // Pass the document ID as a prop
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

export default Feeds;