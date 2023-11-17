import '../../CSS/ProfilePage/ProfilePage_Components_Photos.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ProfilePage_Photos from './ProfilePage_Photos';

function ProfilePage_Components_Photos({userData}) {
    return (
        <div className="ProfilePageComponents_Photos">
            <div className="ProfilePageComponents_Photos_Top">
                <div className="ProfilePageComponents_Photos_TopLeft">
                    <h3>Photos</h3>
                </div>

                <div className="ProfilePageComponents_Photos_TopRight">
                    <p>Add photos</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="ProfilePageComponents_Photos_Middle">
                <ProfilePage_Photos userData={userData} />
            </div>
        </div>
    )
}

export default ProfilePage_Components_Photos