import '../../CSS/ProfilePage/ProfilepageComponentsPhotos.css';
import React from 'react';
import ProfilepagePhotos from './ProfilepagePhotos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsPhotos() {
    return (
        <div className="profilePageComponentsPhotos">
            <div className="profilePageComponentsPhotos_Top">
                <div className="profilePageComponentsPhotos_TopLeft">
                    <h3>Photos</h3>
                </div>

                <div className="profilePageComponentsPhotos_TopRight">
                    <p>Add photos</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="profilePageComponentsPhotos_Middle">
                <ProfilepagePhotos />
            </div>
        </div>
    )
}

export default ProfilepageComponentsPhotos;