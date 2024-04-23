import "../../CSS/UserPage/UserpageFriends.css"
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";

function UserpageFriends() {
    const friendsData = useSelector((state) => state.data.friends.friendsData);

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
                    {friendsData.map((friend, index) => (
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