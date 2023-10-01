import '../../CSS/HomePage/HomePage_Feeds_StoryReels.css'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import HomePage_StoryReels from './HomePage_StoryReels';
import { NavLink, Route, Routes } from 'react-router-dom';

function HomePage_Feeds_StoryReels() {

    return (
        <div className='homepage_feeds_StoryReels'>
            <Routes>
                <Route path='storyreels' element={<HomePage_StoryReels />} />
            </Routes>

            <NavLink to={'/homepage/storyreels'}>
                <div className="homepage_feeds_StoryReels_Inner">
                    <AddIcon />
                    <div className='homepage_feeds_StoryReels_InnerInfo'>
                        <h2>Create Story</h2>
                        <p>Share a photo or write something.</p>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default HomePage_Feeds_StoryReels