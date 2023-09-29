import '../../CSS/FriendsPage/FriendsPage_AllFriends.css'
import React from 'react'
import FriendsPage_AllFriends_Leftbar from './FriendsPage_AllFriends_Leftbar'
import FriendsPage_AllFriends_Main from './FriendsPage_AllFriends_Main'

function FriendsPage_AllFriends() {
    return (
        <div className='friendspage_Allfriends'>
            <div className="friendspage_Allfriends_leftbar">
                <FriendsPage_AllFriends_Leftbar />
            </div>

            <div className='friendspage_Allfriends_Main'>
                <FriendsPage_AllFriends_Main />
            </div>
        </div>
    )
}

export default FriendsPage_AllFriends