import '../../CSS/UserPage/UserPage_Components_Videos.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UserPage_Photos from './UserPage_Photos';

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
                <UserPage_Photos />
            </div>
        </div>
    )
}

export default UserPage_Components_Videos