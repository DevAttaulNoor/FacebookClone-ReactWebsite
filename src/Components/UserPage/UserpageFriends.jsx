import "../../CSS/UserPage/UserpageFriends.css"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendPage/FriendpageAllFriends';

function UserpageFriends() {
    const user = useSelector((state) => state.data.user.user);
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
                <NavLink to="/userhomepage/friend" activeclassname="active">
                    See all friends
                </NavLink>
            </div>

            <div className="userpageFriends_Bottom">
                <div className="userpageFriends_BottomContainer">
                    {friends.map((friend, index) => (
                        <div key={index} className="userpageFriends_BottomContainerOptions">
                            <img src={friend.photoURL} alt="" />
                            <p>{friend.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserpageFriends;