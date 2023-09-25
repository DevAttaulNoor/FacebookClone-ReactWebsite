import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_Leftbar_AllFriends';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';

function HomePage_Rightbar_FriendsList() {
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
        <div className='homepage_rightbar_friendList'>
            <div className="homepage_rightbar_friendListTop">
                <div className="homepage_rightbar_friendListTopLeft">
                    <h4>Contact</h4>
                </div>
                <div className="homepage_rightbar_friendListTopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepage_rightbar_friendListBody">
                {friends.map((friend) => (
                    <div className="homepage_rightbar_friendListBody_Options">
                        <Avatar src={friend.photoURL} />
                        <p>{friend.username}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage_Rightbar_FriendsList