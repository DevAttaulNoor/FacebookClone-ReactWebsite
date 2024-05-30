import '../../CSS/HomePage/HomepageRightbarGroupsList.css'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HomepageRightbarGroupsList() {
    return (
        <div className='homepageRightbarGroupsList'>
            <div className="homepageRightbarGroupsList_Top">
                <div className="homepageRightbarGroupsList_TopLeft">
                    <h4>Group conversations</h4>
                </div>
                <div className="homepageRightbarGroupsList_TopRight">
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepageRightbarGroupsList_Body">
                <div className="homepageRightbarGroupsList_BodyOptions">
                    <AddIcon />
                    <p>Create new group</p>
                </div>
            </div>
        </div>
    )
}

export default HomepageRightbarGroupsList;