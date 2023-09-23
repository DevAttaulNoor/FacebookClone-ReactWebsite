import '../../CSS/FriendsPage/FriendsPage.css'
import React from 'react';
import FriendsPage_Main from './FriendsPage_Main';
import FriendsPage_Leftbar from './FriendsPage_Leftbar';

function FriendsPage() {
    return (
        <div className='friendspage'>
            <div className="friendspage_leftbar">
                <FriendsPage_Leftbar />
            </div>

            <div className='friendspage_Main'>
                <FriendsPage_Main/>
            </div>
        </div>
    );
}

export default FriendsPage;