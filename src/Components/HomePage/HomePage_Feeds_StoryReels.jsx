import '../../CSS/HomePage/HomePage_Feeds_StoryReels.css'
import React from 'react'
import { Avatar } from '@mui/material'
import { useStateValue } from '../BackendRelated/StateProvider'
import AddIcon from '@mui/icons-material/Add';

function HomePage_Feeds_StoryReels() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className='homepage_feedsStoryReels'>
            <div className="story myStory">
                <img src={user.photoURL} alt="" />
                <div className='addStory'>
                    <AddIcon/>
                    <h3>Create story</h3>
                </div>
            </div>
            <div className="story" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1667404187122-5c8f0500ec59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60')" }}>
                <Avatar />
                <h4>Abdul Maaz</h4>
            </div>
            <div className="story" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622447036013-a7e7367759c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJhY2tncm91bmQlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60')" }}>
                <Avatar />
                <h4>Mohammad Bilal</h4>
            </div>
            <div className="story" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJhY2tncm91bmQlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60')" }}>
                <Avatar />
                <h4>Miniminter</h4>
            </div>
        </div>
    )
}

export default HomePage_Feeds_StoryReels