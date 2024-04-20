import '../../CSS/HomePage/HomepageRightbarGroupsList.css'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HomepageRightbarGroupsList() {
    return (
        <div className='homepage_rightbar_groupslist'>
            <div className="homepage_rightbar_groupslistTop">
                <div className="homepage_rightbar_groupslistTopLeft">
                    <h4>Group conversations</h4>
                </div>
                <div className="homepage_rightbar_groupslistTopRight">
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepage_rightbar_groupslistBody">
                <div className="homepage_rightbar_groupslistBodyOptions">
                    <AddIcon />
                    <p>Create New Group</p>
                </div>
            </div>
        </div>
    )
}

export default HomepageRightbarGroupsList;