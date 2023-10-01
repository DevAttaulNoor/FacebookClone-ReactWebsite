import '../../CSS/HomePage/HomePage_StoryReels_Leftbar.css'
import React from 'react'
import { useStateValue } from '../BackendRelated/StateProvider';
import SettingsIcon from '@mui/icons-material/Settings';

function HomePage_StoryReels_Leftbar() {
    const [{ user }] = useStateValue()

    return (
        <div className='homepage_storyreels_Leftbar'>
            <div className='homepage_storyreels_LeftbarTop'>
                <div className="homepage_storyreels_LeftbarTop_Top">
                    <p>Your story</p>
                    <SettingsIcon />
                </div>
                <div className="homepage_storyreels_LeftbarTop_Bottom">
                    <img src={user.photoURL} alt="" />
                    <p>{user.displayName}</p>
                </div>
            </div>
            <hr id='line' />
        </div>
    )
}

export default HomePage_StoryReels_Leftbar