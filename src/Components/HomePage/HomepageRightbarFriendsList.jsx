import '../../CSS/HomePage/HomepageRightbarFriendsList.css'
import React, { useState } from 'react'
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux'
import HomepageMessage from './HomepageMessage';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HomepageRightbarFriendsList() {
    const friendsData = useSelector((state) => state.data.friends.friendsData);
    const [selectedFriend, setSelectedFriend] = useState();
    const [friendMessageBox, setFriendMessageBox] = useState(false);

    const openFriendMessageBox = (friend) => {
        setSelectedFriend(friend);
        setFriendMessageBox(true);
    };

    const closeFriendMessageBox = () => {
        setSelectedFriend(null);
        setFriendMessageBox(false);
    }

    return (
        <div className='homepageRightbarFriendsList'>
            <div className="homepageRightbarFriendsList_Top">
                <div className="homepageRightbarFriendsList_TopLeft">
                    <h4>Contacts</h4>
                </div>

                <div className="homepageRightbarFriendsList_TopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepageRightbarFriendsList_Bottom">
                {friendsData.map((friend, index) => (
                    <div
                        className="homepageRightbarFriendsList_BottomOption"
                        key={index}
                        onClick={() => openFriendMessageBox(friend)}
                    >
                        <Avatar src={friend.photoURL} />
                        <p>{friend.username}</p>
                    </div>
                ))}
            </div>

            <HomepageMessage handleSelectedFriend={selectedFriend} closeFriendBox={closeFriendMessageBox} />
        </div>
    )
}

export default HomepageRightbarFriendsList