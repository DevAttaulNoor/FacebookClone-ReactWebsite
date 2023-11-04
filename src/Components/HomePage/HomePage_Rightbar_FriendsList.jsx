import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import HomePage_Messages from '../HomePage/HomePage_Messages';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HomePage_Rightbar_FriendsList() {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);
    const [messageBox, setMessageBox] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const openMessageBox = (friend) => {
        setMessageBox(true);
        setSelectedFriend(friend);
    };

    const closeMessageBox = () => {
        setMessageBox(false);
        setSelectedFriend(null);
    }

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
        <div className='homepageRightbarFriendList'>
            <div className="homepageRightbarFriendList_Top">
                <div className="homepageRightbarFriendList_TopLeft">
                    <h4>Contacts</h4>
                </div>

                <div className="homepageRightbarFriendList_TopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepageRightbarFriendList_Bottom">
                {friends.map((friend) => (
                    <div
                        className="homepageRightbarFriendList_BottomOption"
                        key={friend.id}
                        onClick={() => openMessageBox(friend)}
                    >
                        <Avatar src={friend.photoURL} />
                        <p>{friend.username}</p>
                    </div>
                ))}
            </div>

            <HomePage_Messages handleSelectedFriend={selectedFriend} closeBox={closeMessageBox} />
        </div>
    )
}

export default HomePage_Rightbar_FriendsList