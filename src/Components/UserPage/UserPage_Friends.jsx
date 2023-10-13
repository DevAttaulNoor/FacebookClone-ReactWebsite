import "../../CSS/UserPage/UserPage_Friends.css"
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';

function UserPage_Friends() {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch friends data when user.uid changes
        fetchFriendsData(user.uid, setFriends);
    }, [user.uid]);

    useEffect(() => {
        // Fetch friend details when friends array changes
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    return (
        <div className='userpageFriends'>
            <div className="userpageFriends_Top">
                <h3>Friends</h3>
                <a href="#">See all friends</a>
            </div>

            <div className="userpageFriends_Bottom">
                <div className="userpageFriends_BottomContainer">
                    {friends.map((friend) => (
                        <div className="userpageFriends_BottomContainerOptions">
                            <img src={friend.photoURL} alt="" />
                            <p>{friend.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserPage_Friends