import '../CSS/Feeds.css'
import React, { useEffect, useState } from 'react'
import Storyreels from './Storyreels'
import MessageSender from './MessageSender'
import Posts from './Posts'
import { db } from './Firebase'

function Feeds() {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        db.collection("Posts").orderBy("timestamp", "desc").onSnapshot(snapshot=>{
            setPosts(snapshot.docs.map(doc=>({
                id: doc.id,
                data: doc.data()
            })))
        });
    },[]);

    const convertTimestampToReadableDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toDateString(); // You can format the date further if needed
    }

    return (
        <div className='feeds'>
            <Storyreels />
            <MessageSender />
            {
                posts.map(post=>{
                    const formattedDate = convertTimestampToReadableDate(post.data.timestamp);
                    return <Posts photoURL={post.data.photoURL} image={post.data.image} username={post.data.username} timestamp={formattedDate} message={post.data.message} />
                })
            }
        </div>
    )
}

export default Feeds