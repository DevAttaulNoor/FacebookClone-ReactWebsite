import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function HomePage_Rightbar_FriendsList({ close }) {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);


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

    const handleFriendClick = (friend) => {
        // Set the selected friend when a friend is clicked
        setSelectedFriend(friend);
        setIsDialogVisible(true); // Show the friend's message box
    };

    const handleEmojiIconClick = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible); // Toggle EmojiPicker visibility
    };

    return (
        <div className='homepage_rightbar_friendList'>
            <div className="homepage_rightbar_friendListTop">
                <div className="homepage_rightbar_friendListTopLeft">
                    <h4>Contacts</h4>
                </div>
                <div className="homepage_rightbar_friendListTopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepage_rightbar_friendListBody">
                {friends.map((friend) => (
                    <div
                        className="homepage_rightbar_friendListBody_Options"
                        key={friend.id}
                        onClick={() => handleFriendClick(friend)} // Handle friend click
                    >
                        <Avatar src={friend.photoURL} />
                        <p>{friend.username}</p>
                    </div>
                ))}

                {selectedFriend && (
                    <div className='FriendMessages'>
                        <div className="FriendMessages_Top">
                            <div className='FriendMessages_TopLeft'>
                                <Avatar src={selectedFriend.photoURL} />
                                <p>{selectedFriend.username}</p>
                            </div>

                            <div className='FriendMessages_TopRight'>
                                <HorizontalRuleIcon />
                                <CloseIcon onClick={() => {
                                    setSelectedFriend(null);
                                    setIsEmojiPickerVisible(false); // Close the EmojiPicker
                                }} />
                            </div>
                        </div>

                        <div className="FriendMessages_Middle">
                            <Avatar src={selectedFriend.photoURL} />
                            <h3>{selectedFriend.username}</h3>
                            <p>Facebook</p>
                            <p>You're friends on Facebook</p>
                        </div>

                        <div className='FriendMessages_Bottom'>
                            <AddCircleIcon />
                            <div className='inputSection'>
                                <input type='text' placeholder='Aa'/>
                                <EmojiEmotionsIcon className='emojiIcon' onClick={handleEmojiIconClick} />
                            </div>
                            {isEmojiPickerVisible && <EmojiPicker />}
                            <SendIcon />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage_Rightbar_FriendsList