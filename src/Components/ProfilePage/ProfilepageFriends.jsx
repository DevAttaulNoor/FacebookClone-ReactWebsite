import "../../CSS/ProfilePage/ProfilepageFriends.css"
import React from 'react';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function ProfilepageFriends({ userData }) {
    const friendFriendsData = useSelector((state) => state.data.friends.friendFriendsData);

    return (
        <div className='ProfilePageFriends'>
            <div className="ProfilePageFriends_Top">
                <NavLink id="navLink" to="/profilepage/:userid/friend" activeClassName="active">
                    <h3>Friends</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all friends</a>
            </div>

            <div className="ProfilePageFriends_Bottom">
                <div className="ProfilePageFriends_BottomContainer">
                    {friendFriendsData.map((friend) => (
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

export default ProfilepageFriends;