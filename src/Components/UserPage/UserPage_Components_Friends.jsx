import '../../CSS/UserPage/UserPage_Components_Friends.css'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UserPage_Friends from './UserPage_Friends';

function UserPage_Components_Friends() {
    return (
        <div className="UserpageComponents_Friends">
            <div className="UserpageComponents_Friends_Top">
                <div className="UserpageComponents_Friends_TopLeft">
                    <h3>Friends</h3>
                </div>

                <div className="UserpageComponents_Friends_TopRight">
                    <div className='searchInp'>
                        <SearchIcon />
                        <input type="text" placeholder='Search Friends' />
                    </div>

                    <p>Friends requests</p>
                    <p>Find Friends</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="UserpageComponents_Friends_Middle">
               <UserPage_Friends />
            </div>
        </div>
    )
}

export default UserPage_Components_Friends