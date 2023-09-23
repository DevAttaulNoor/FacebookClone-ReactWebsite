import '../../CSS/FriendsPage/FriendsPage_Leftbar.css'
import React from 'react';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

function FriendsPage_Leftbar() {
    return (
        <div className='friendspageLeftbar'>
            <div className="friendspageLeftbar_Top">
                <p>Friends</p>
                <SettingsIcon />
            </div>

            <div className="friendspageLeftbar_Bottom">
                <Link to="/friendpage/">Home</Link>
                <Link to="/friendpage/friendReqs">Friend Requests</Link>
                <Link to="/friendpage/allFriends">All friends</Link>
            </div>
        </div>
    )
}

export default FriendsPage_Leftbar