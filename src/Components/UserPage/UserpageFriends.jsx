import "../../CSS/UserPage/UserpageFriends.css"
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";

function UserpageFriends() {
    const friendsData = useSelector((state) => state.data.friends.friendsData);

    return (
        <div className='userpageFriends'>
            <div className="userpageFriendsTop">
                <h3>Friends</h3>
                <NavLink to="/userhomepage/friend" activeclassname="active">
                    See all friends
                </NavLink>
            </div>

            <div className="userpageFriendsBottom">
                <div className="userpageFriendsBottomContainer">
                    {friendsData.map((friend, index) => (
                        <div key={index} className="userpageFriendsBottomContainerOptions">
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