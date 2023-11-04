import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { db } from '../BackendRelated/Firebase';
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

function HomePage_Rightbar_FriendsList() {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
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

    const handleEmojiIconClick = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible); // Toggle EmojiPicker visibility
    };
    
    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setIsDialogVisible(true);
    };

    const sendMessage = async () => {
        if (messageInput.trim() === '') {
            return;
        }

        if (!selectedFriend || !selectedFriend.friendUid || !user.uid) {
            console.error('Recipient or sender is undefined');
            return;
        }

        const chatId = user.uid < selectedFriend.friendUid
            ? `${user.uid}_${selectedFriend.friendUid}`
            : `${selectedFriend.friendUid}_${user.uid}`;

        const newMessage = {
            text: messageInput,
            sender: user.uid,
            recipient: selectedFriend.friendUid,
            timestamp: new Date(),
        };

        // Retrieve the existing messages for the chat
        const chatDocRef = db.collection('Chats').doc(chatId);
        const chatDoc = await chatDocRef.get();

        if (chatDoc.exists) {
            const existingMessages = chatDoc.data().messages || [];
            const updatedMessages = [...existingMessages, newMessage];

            // Update the messages field in the document
            await chatDocRef.update({ messages: updatedMessages });
        }

        else {
            // If the chat document doesn't exist, create it with the new message
            await chatDocRef.set({ messages: [newMessage] });
        }

        // Clear the message input
        setMessageInput('');
    };

    const timeAgowithInitials = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0s"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            D: 315360000,
            Y: 31536000,
            M: 2628000,
            w: 604800,
            d: 86400,
            h: 3600,
            m: 60,
            s: 1,
        };

        let elapsed = 0;
        let granularity = 0;
        let unit = '';

        for (const period in periods) {
            elapsed = Math.floor(secondsDifference / periods[period]);

            if (elapsed >= 1) {
                granularity = elapsed;
                unit = period;
                break;
            }
        }
        return `${granularity}${unit}${granularity > 1 ? '' : ''}`;
    };

    useEffect(() => {
        if (selectedFriend) {
            const userUid = user.uid;
            const friendUid = selectedFriend.friendUid;
    
            const chatId = userUid < friendUid
                ? `${userUid}_${friendUid}`
                : `${friendUid}_${userUid}`;
    
            const chatCollection = db.collection('Chats').doc(chatId);
    
            const unsubscribe = chatCollection.onSnapshot((doc) => {
                if (doc.exists) {
                    const chatData = doc.data();
                    if (chatData.messages) {
                        setMessages(chatData.messages);
                    } else {
                        setMessages([]); // No messages available
                    }
                } else {
                    setMessages([]); // Chat document doesn't exist
                }
            });
    
            return () => {
                // Unsubscribe from the snapshot listener when the component unmounts.
                unsubscribe();
            };
        }
    }, [selectedFriend, user.uid]);
    
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
                        {/* {console.log(friend.friendUid)} */}
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
                            <div className='friendIntro'>
                                <Avatar src={selectedFriend.photoURL} />
                                <h3>{selectedFriend.username}</h3>
                                <p>Facebook</p>
                                <p>You're friends on Facebook</p>
                            </div>

                            {messages.map((message) => (
                                <div key={message.timestamp} className={`message ${message.sender === user.uid ? 'sent' : 'received'}`}>
                                    <p id='messageContent'>{message.text}</p>
                                    <p id='messageTimestamp'>{timeAgowithInitials(message.timestamp)}</p>
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