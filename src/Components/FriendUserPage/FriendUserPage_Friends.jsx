import '../../CSS/FriendUserPage/FriendUserPage_Friends.css'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';

function FriendUserPage_Friends() {
    const { friendUid } = useParams();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriendsData(friendUid, setFriends);
    }, [friendUid]);

    useEffect(() => {
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    return (
        <div className='frienduserpage_Friends'>
            <div className="frienduserpage_FriendsTop">
                <h2>Friends</h2>
                <a href="#">See all friends</a>
            </div>
            
            <div className="frienduserpage_FriendsBottom">
                <div className="frienduserpage_FriendsContainer">
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

export default FriendUserPage_Friends