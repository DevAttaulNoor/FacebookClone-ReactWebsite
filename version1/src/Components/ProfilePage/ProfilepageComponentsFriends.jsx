import '../../CSS/ProfilePage/ProfilepageComponentsFriends.css'
import React from 'react';
import ProfilepageFriends from './ProfilepageFriends';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsFriends() {
    return (
        <div className="profilePageComponentsFriends">
            <div className="profilePageComponentsFriends_Top">
                <div className="profilePageComponentsFriends_TopLeft">
                    <h3>Friends</h3>
                </div>

                <div className="profilePageComponentsFriends_TopRight">
                    <div className='searchInp'>
                        <SearchIcon />
                        <input type="text" placeholder='Search Friends' />
                    </div>

                    <p>Friends requests</p>
                    <p>Find Friends</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="profilePageComponentsFriends_Middle">
               <ProfilepageFriends />
            </div>
        </div>
    )
}

export default ProfilepageComponentsFriends;