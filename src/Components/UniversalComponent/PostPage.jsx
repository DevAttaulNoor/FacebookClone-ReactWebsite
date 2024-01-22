import "../../CSS/UniversalComponent/PostPage.css"
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { db } from "../BackendRelated/Firebase";
import HomePage_Feeds_Posts from "../HomePage/HomePage_Feeds_Posts";

function PostPage() {
    let location = useLocation();
    let postId = location.state.from;
    const [post, setPost] = useState(null);

    useEffect(() => {
        const postRef = db.collection('Posts').doc(postId);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPost(doc.data());
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [postId]);

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
        <div className="postPage">
            {/* {console.log(post)} */}
            <div className="postPageInner">
                {/* <HomePage_Feeds_Posts
                    id={postId}
                    userid={post.uid}
                    photoURL={post.photoURL}
                    media={post.media}
                    mediaType={post.mediaType}
                    username={post.username}
                    timestamp={timeAgo(post.timestamp)}
                    message={post.message}
                /> */}

                <div className="postPageInner_Top">
                    
                </div>
            </div>
        </div>
    );
}

export default PostPage