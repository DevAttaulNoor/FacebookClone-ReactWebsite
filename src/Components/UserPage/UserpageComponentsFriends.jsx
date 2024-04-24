import '../../CSS/UserPage/UserpageComponentsFriends.css'
import React from 'react';
import UserpageFriends from './UserpageFriends';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function UserpageComponentsFriends() {
    return (
        <div className="userpageComponentsFriends">
            <div className="userpageComponentsFriends_Top">
                <div className="userpageComponentsFriends_TopLeft">
                    <h3>Friends</h3>
                </div>

                <div className="userpageComponentsFriends_TopRight">
                    <div className='searchInp'>
                        <SearchIcon />
                        <input type="text" placeholder='Search Friends' />
                    </div>

                    <p>Friends requests</p>
                    <p>Find Friends</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="userpageComponentsFriends_Middle">
               <UserpageFriends />
            </div>
        </div>
    )
}

export default UserpageComponentsFriends;