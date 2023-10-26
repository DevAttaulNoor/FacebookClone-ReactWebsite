import '../../CSS/UserPage/UserPage_Components_Photos.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UserPage_Photos from './UserPage_Photos';

function UserPage_Components_Photos() {
    return (
        <div className="UserpageComponents_Photos">
            <div className="UserpageComponents_Photos_Top">
                <div className="UserpageComponents_Photos_TopLeft">
                    <h3>Photos</h3>
                </div>

                <div className="UserpageComponents_Photos_TopRight">
                    <p>Add photos</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="UserpageComponents_Photos_Middle">
                <UserPage_Photos />
            </div>
        </div>
    )
}

export default UserPage_Components_Photos