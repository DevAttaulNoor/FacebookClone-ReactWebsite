import '../../CSS/ProfilePage/ProfilePage_Components_Videos.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ProfilePage_Videos from './ProfilePage_Videos';

function ProfilePage_Components_Videos({userData}) {
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
                <ProfilePage_Videos userData={userData} />
            </div>
        </div>
    )
}

export default ProfilePage_Components_Videos