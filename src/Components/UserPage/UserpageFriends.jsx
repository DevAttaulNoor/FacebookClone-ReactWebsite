import "../../CSS/UserPage/UserpageFriends.css"
import React from 'react';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFriend } from "../../Redux/friendSlice";

function UserpageFriends() {
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.data.friends.friends);
    const friendsData = useSelector((state) => state.data.friends.friendsData);

    return (
        <>
            {friends.length > 0 && (
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
                                <NavLink to={`/profilepage/${friend.friendUid}/post`} onClick={() => dispatch(setSelectedFriend(friend.friendUid))} key={index}>
                                    <div className="userpageFriendsBottomContainerOptions">
                                        <img src={friend.photoURL} alt="" />
                                        <p>{friend.username}</p>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserpageFriends;