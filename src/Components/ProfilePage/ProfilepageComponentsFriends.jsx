import '../../CSS/ProfilePage/ProfilepageComponentsFriends.css'
import React from 'react';
import ProfilepageFriends from './ProfilepageFriends';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ProfilepageComponentsFriends({userData}) {
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
               <ProfilepageFriends userData={userData}/>
            </div>
        </div>
    )
}

export default ProfilepageComponentsFriends;