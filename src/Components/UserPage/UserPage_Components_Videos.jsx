import '../../CSS/UserPage/UserPage_Components_Videos.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UserPage_Videos from './UserPage_Videos';

function UserPage_Components_Videos() {
    return (
        <div className="UserpageComponents_Videos">
            <div className="UserpageComponents_Videos_Top">
                <div className="UserpageComponents_Videos_TopLeft">
                    <h3>Videos</h3>
                </div>

                <div className="UserpageComponents_Videos_TopRight">
                    <p>Add videos</p>
                    <MoreHorizIcon className='moreOptions' />
                </div>
            </div>

            <div className="UserpageComponents_Videos_Middle">
                <UserPage_Videos />
            </div>
        </div>
    )
}

export default UserPage_Components_Videos