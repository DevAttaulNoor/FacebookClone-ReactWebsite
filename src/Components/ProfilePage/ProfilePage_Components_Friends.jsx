import '../../CSS/ProfilePage/ProfilePage_Components_Friends.css'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ProfilePage_Friends from './ProfilePage_Friends';

function ProfilePage_Components_Friends({userData}) {
    return (
        <div className="ProfilePageComponents_Friends">
            <div className="ProfilePageComponents_Friends_Top">
                <div className="ProfilePageComponents_Friends_TopLeft">
                    <h3>Friends</h3>
                </div>

                <div className="ProfilePageComponents_Friends_TopRight">
                    <div className='searchInp'>
                        <SearchIcon />
                        <input type="text" placeholder='Search Friends' />
                    </div>

                    <p>Friends requests</p>
                    <p>Find Friends</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="ProfilePageComponents_Friends_Middle">
               <ProfilePage_Friends userData={userData}/>
            </div>
        </div>
    )
}

export default ProfilePage_Components_Friends