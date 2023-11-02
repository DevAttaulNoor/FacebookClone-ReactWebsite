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
import { db } from '../BackendRelated/Firebase';

function HomePage_Rightbar_FriendsList({ close }) {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const [messages, setMessages] = useState([]); // Store messages
    const [messageInput, setMessageInput] = useState('');



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

        // Fetch messages for the selected friend and set them in the state
        db.collection('Messages')
            .where('recipient', '==', user.uid)
            .where('sender', '==', friend.id)
            .onSnapshot((snapshot) => {
                const messages = [];
                snapshot.forEach((doc) => {
                    messages.push(doc.data());
                });
                setMessages(messages);
            });
    };

    const handleEmojiIconClick = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible); // Toggle EmojiPicker visibility
    };

    // Handle sending a message
    const sendMessage = () => {
        if (messageInput.trim() === '') {
            return;
        }

        // Update messages state
        const newMessage = {
            text: messageInput,
            sender: user.uid,
            recipient: selectedFriend.id,
            timestamp: new Date().toISOString(),
        };

        setMessages([...messages, newMessage]);

        // Save the message in Firestore
        db.collection('Messages').add(newMessage);

        // Clear the message input
        setMessageInput('');
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

                            {messages.map((message) => (
                                <div key={message.timestamp} className={`message ${message.sender === user.uid ? 'sent' : 'received'}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>

                        <div className='FriendMessages_Bottom'>
                            <AddCircleIcon />
                            <div className='inputSection'>
                                <input
                                    type='text'
                                    placeholder='Aa'
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <EmojiEmotionsIcon className='emojiIcon' onClick={handleEmojiIconClick} />
                            </div>
                            {isEmojiPickerVisible && <EmojiPicker />}
                            <SendIcon onClick={sendMessage} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage_Rightbar_FriendsList