import '../../CSS/HomePage/HomePage_StoryReels.css'
import React from 'react'
import HomePage_StoryReels_Main from './HomePage_StoryReels_Main'
import HomePage_StoryReels_Leftbar from './HomePage_StoryReels_Leftbar'

function HomePage_StoryReels() {
    return (
        <div className='homepage_StoryReels'>
            <div className="homepage_StoryReels_Leftbar">
                <HomePage_StoryReels_Leftbar />
            </div>

            <div className="homepage_StoryReels_Main">
                <HomePage_StoryReels_Main />
            </div>
        </div>
    )
}

export default HomePage_StoryReels