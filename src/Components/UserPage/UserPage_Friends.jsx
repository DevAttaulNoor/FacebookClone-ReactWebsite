import "../../CSS/UserPage/UserPage_Friends.css"
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { useStateValue } from "../BackendRelated/StateProvider";
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
                <NavLink id="navLink" to="/userhomepage/friend" activeclassname="active">
                    <h3>Friends</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all friends</a>
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

export default UserPage_Friends