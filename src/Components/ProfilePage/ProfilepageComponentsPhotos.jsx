import '../../CSS/ProfilePage/ProfilepageComponentsPhotos.css';
import React from 'react';
import ProfilepagePhotos from './ProfilepagePhotos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsPhotos({userData}) {
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
                <ProfilepagePhotos userData={userData} />
            </div>
        </div>
    )
}

export default ProfilepageComponentsPhotos;