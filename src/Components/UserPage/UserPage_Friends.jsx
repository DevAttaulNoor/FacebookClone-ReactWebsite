import "../../CSS/UserPage/UserPage_Friends.css"
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_Main_AllFriends';

function UserPage_Friends() {
    const [{ user }, dispatch] = useStateValue();
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
        <div className='userpage_Friends'>
            <div className="userpage_Friends_top">
                <h2>Friends</h2>
                <a href="#">See all friends</a>
            </div>
            <div className="userpage_Friends_bottom">
                <div className="userpage_friendsContainer">
                    {friends.map((friend) => (
                        <div className="friend">
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