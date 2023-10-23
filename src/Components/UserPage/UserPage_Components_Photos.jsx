import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function UserPage_Components_Photos() {
    return (
        <div className="UserpageComponents_Photos">
            <div className="UserpageComponents_Photos_Top">
                <div className="UserpageComponents_Photos_TopLeft">
                    <h3>Photos</h3>
                </div>
                <div className="UserpageComponents_Photos_TopRight">
                    <p>Add photos/video</p>
                    <MoreHorizIcon />
                </div>

            </div>
            <div className="UserpageComponents_Photos_Middle">
                <img src="" alt="" />
            </div>
        </div>
    )
}

export default UserPage_Components_Photos