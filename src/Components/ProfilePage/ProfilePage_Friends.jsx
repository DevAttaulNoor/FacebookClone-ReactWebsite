import "../../CSS/ProfilePage/ProfilePage_Friends.css"
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { useStateValue } from "../BackendRelated/StateProvider";
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';

function ProfilePage_Friends() {
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
        <div className='ProfilePageFriends'>
            <div className="ProfilePageFriends_Top">
                <NavLink id="navLink" to="/userhomepage/friend" activeClassName="active">
                    <h3>Friends</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all friends</a>
            </div>

            <div className="ProfilePageFriends_Bottom">
                <div className="ProfilePageFriends_BottomContainer">
                    {friends.map((friend) => (
                        <div className="ProfilePageFriends_BottomContainerOptions">
                            <img src={friend.photoURL} alt="" />
                            <p>{friend.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage_Friends