import '../../CSS/ProfilePage/ProfilepageComponentsVideos.css'
import React from 'react'
import ProfilepageVideos from './ProfilepageVideos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsVideos({userData}) {
    return (
        <div className="ProfilePageComponents_Videos">
            <div className="ProfilePageComponents_Videos_Top">
                <div className="ProfilePageComponents_Videos_TopLeft">
                    <h3>Videos</h3>
                </div>

                <div className="ProfilePageComponents_Videos_TopRight">
                    <p>Add videos</p>
                    <MoreHorizIcon className='moreOptions' />
                </div>
            </div>

            <div className="ProfilePageComponents_Videos_Middle">
                <ProfilepageVideos userData={userData} />
            </div>
        </div>
    )
}

export default ProfilepageComponentsVideos;