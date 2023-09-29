import '../../CSS/HomePage/HomePage_StoryReels.css'
import { NavLink, Route, Routes } from 'react-router-dom';
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import HomePage_StoryReels_Main from './HomePage_StoryReels_Main';

function HomePage_StoryReels() {
    return (
        <div className='homepageStoryReels'>
            <Routes>
                <Route path='storyreels' element={<HomePage_StoryReels_Main />} />
            </Routes>

            <NavLink to={'/homepage/storyreels'}>
                <div className="homepageStoryReels_Inner">
                    <AddIcon />
                    <div className='homepageStoryReels_InnerInfo'>
                        <h2>Create Story</h2>
                        <p>Share a photo or write something.</p>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default HomePage_StoryReels