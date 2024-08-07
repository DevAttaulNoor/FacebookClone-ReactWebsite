import "../../CSS/ProfilePage/ProfilepageFriends.css"
import React from 'react';
import { Avatar } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function ProfilepageFriends() {
    const friendFriends = useSelector((state) => state.data.friends.friendFriends)
    const friendFriendsData = useSelector((state) => state.data.friends.friendFriendsData);

    return (
        <>
            {friendFriends.length > 0 && (
                <div className='profilePageFriends'>
                    <div className="profilePageFriends_Top">
                        <NavLink id="navLink" to="/profilepage/:userid/friend" activeclassname="active">
                            <h3>Friends</h3>
                        </NavLink>
                        <p id="seeAllLink">See all friends</p>
                    </div>

                    <div className="profilePageFriends_Bottom">
                        <div className="profilePageFriends_BottomContainer">
                            {friendFriendsData.map((friend) => (
                                <div className="profilePageFriends_BottomContainerOptions" key={friend.friendUid}>
                                    <Avatar src={friend.photoURL}/>
                                    <p>{friend.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProfilepageFriends;