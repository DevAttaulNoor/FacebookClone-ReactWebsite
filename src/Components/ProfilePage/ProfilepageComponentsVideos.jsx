import '../../CSS/ProfilePage/ProfilepageComponentsVideos.css'
import React from 'react'
import ProfilepageVideos from './ProfilepageVideos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsVideos() {
    return (
        <div className="profilePageComponentsVideos">
            <div className="profilePageComponentsVideos_Top">
                <div className="profilePageComponentsVideos_TopLeft">
                    <h3>Videos</h3>
                </div>

                <div className="profilePageComponentsVideos_TopRight">
                    <p>Add videos</p>
                    <MoreHorizIcon className='moreOptions' />
                </div>
            </div>

            <div className="profilePageComponentsVideos_Middle">
                <ProfilepageVideos />
            </div>
        </div>
    )
}

export default ProfilepageComponentsVideos;