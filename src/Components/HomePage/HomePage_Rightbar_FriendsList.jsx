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
        // Set the selected friend when a friend is clicked
        setSelectedFriend(friend);
        setIsDialogVisible(true);

        // Fetch messages for the selected friend and set them in the state
        db.collection('Messages')
            .where('person1', '==', user.uid)
            .where('person2', '==', friend.friendUid)
            .get()
            .then((querySnapshot1) => {
                // Query for messages where user.uid is person1 and friend.friendUid is person2

                const messages1 = [];
                querySnapshot1.forEach((doc) => {
                    messages1.push(doc.data());
                });

                db.collection('Messages')
                    .where('person1', '==', friend.friendUid)
                    .where('person2', '==', user.uid)
                    .get()
                    .then((querySnapshot2) => {
                        // Query for messages where friend.friendUid is person1 and user.uid is person2

                        const messages2 = [];
                        querySnapshot2.forEach((doc) => {
                            messages2.push(doc.data());
                        });

                        // Combine the messages from both queries
                        const combinedMessages = messages1.concat(messages2);
                        setMessages(combinedMessages);
                    })
                    .catch((error) => {
                        console.error('Error getting messages for person1 === friendUid: ', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting messages for person1 === user.uid: ', error);
            });

    };

    const sendMessage = () => {
        if (messageInput.trim() === '') {
            return;
        }

        if (!selectedFriend || !selectedFriend.friendUid || !user.uid) {
            // Handle the case where recipient, sender, or selectedFriend is undefined
            console.error('Recipient or sender is undefined');
            return;
        }

        // Update messages state
        const newMessage = {
            text: messageInput,
            person1: user.uid,
            person2: selectedFriend.friendUid,
            timestamp: new Date().toISOString(),
        };

        setMessages([...messages, newMessage]);

        // Save the message in Firestore
        // db.collection('Messages').collection('conversations').add(newMessage);

        db.collection('Messages').add(newMessage);

        // Clear the message input
        setMessageInput('');
    };

    const timeAgo = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0 second ago"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            decade: 315360000,
            year: 31536000,
            month: 2628000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
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
        return `${granularity} ${unit}${granularity > 1 ? 's' : ''} ago`;
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
                                <div key={timeAgo(message.timestamp)} className={`message ${message.person1 === user.uid ? 'sent' : 'received'}`}>
                                    <p id='messageContent'>{message.text}</p>
                                    <p id='messageTimestamp'>{timeAgo(message.timestamp)}</p>
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