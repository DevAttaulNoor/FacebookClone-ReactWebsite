import React, { useEffect, useState } from 'react'
import '../CSS/Feeds.css'
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

    return (
        <div className='feeds'>
            <Storyreels />
            <MessageSender />
            {
                posts.map(post=>{
                    return <Posts photoURL={post.data.photoURL} image={post.data.image} username={post.data.username} timestamp="1:10 pm" message={post.data.message} />
                })
            }
        </div>
    )
}

export default Feeds