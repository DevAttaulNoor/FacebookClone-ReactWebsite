import '../../CSS/HomePage/HomePage_Messages.css'
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../BackendRelated/Firebase';
import { Avatar } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useStateValue } from '../BackendRelated/StateProvider';

function HomePage_Messages({ close, closeBox, handleSelectedFriend }) {
    const [comment, setComment] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);


    const [{ user }] = useStateValue();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const toggleUserSelection = (userId, username, photoURL) => {
        const isUserSelected = selectedUsers.some(user => user.userId === userId);
        if (!isUserSelected) {
            // Select the user and store the username and photoURL
            setSelectedUsers([...selectedUsers, { userId, username, photoURL }]);
        }
        setSearchText('');
    };

    const deselectUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
    };

    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
    };

    useEffect(() => {
        if (searchText === '') {
            // Reset matching usernames when search input is empty
            setMatchingUsernames([]);
            return;
        }

        db.collection("Users")
            .get()
            .then((querySnapshot) => {
                const matchingUsernames = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            Uid: data.Uid,
                            username: data.username,
                            photoURL: data.photoURL,
                        };
                    })
                    .filter((user) =>
                        user.username.toLowerCase().includes(searchText.toLowerCase())
                    );
                setMatchingUsernames(matchingUsernames);
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    }, [searchText]);






    const handleEmojiIconClick = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible); // Toggle EmojiPicker visibility
    };

    const sendMessage = async () => {
        if (messageInput.trim() === '') {
            return;
        }

        if (!handleSelectedFriend || !handleSelectedFriend.friendUid || !user.uid) {
            console.error('Recipient or sender is undefined');
            return;
        }

        const chatId = user.uid < handleSelectedFriend.friendUid
            ? `${user.uid}_${handleSelectedFriend.friendUid}`
            : `${handleSelectedFriend.friendUid}_${user.uid}`;

        const newMessage = {
            text: messageInput,
            sender: user.uid,
            recipient: handleSelectedFriend.friendUid,
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
        if (handleSelectedFriend) {
            const userUid = user.uid;
            const friendUid = handleSelectedFriend.friendUid;

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
    }, [handleSelectedFriend, user.uid]);

    return (
        <>
            {isDialogVisible && (
                <div className='HomePageMessages'>
                    <div className="HomePageMessages_Top">
                        <div className='HomePageMessages_TopLeft'>
                            <p>New message</p>
                        </div>

                        <div className='HomePageMessages_TopRight'>
                            <HorizontalRuleIcon />
                            <CloseIcon onClick={close} />
                        </div>
                    </div>

                    <div className="HomePageMessages_Middle">
                        <p id='toText'>To: </p>

                        <div className="HomePageMessages_MiddleRight">
                            {selectedUsers.length > 0 && (
                                <div className="selectedUserSection">
                                    {selectedUsers.map((user) => (
                                        <div key={user.userId} className="selectedUser">
                                            <p>{user.username}</p>
                                            <CloseIcon onClick={() => deselectUser(user.userId)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onClick={() => setIsSearchBoxVisible(!isSearchBoxVisible)}
                            />
                        </div>
                    </div>

                    <div className="HomePageMessages_Bottom">
                        {selectedUsers.length > 0 && (
                            <div className="HomePageMessages_BottomInner">
                                {selectedUsers.map((user) => (
                                    <div key={user.userId} className="HomePageMessages_BottomInner_Top">
                                        <Avatar src={user.photoURL} />
                                        <p>{user.username}</p>
                                    </div>
                                ))}

                                <div className='HomePageMessages_BottomInner_Bottom'>
                                    <AddCircleIcon />
                                    <div className='inputSection'>
                                        <input type='text' placeholder='Aa' value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <EmojiEmotionsIcon className='emojiIcon' onClick={toggleDialog} ref={dialogBoxRef} />

                                    </div>
                                    {isDialogVisible && (
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    )}
                                    <SendIcon />
                                </div>
                            </div>
                        )}

                        {searchText !== '' && matchingUsernames.length === 0 ? (
                            <p id='noMatch'>No matches</p>
                        ) : (
                            matchingUsernames.map((user) => (
                                <div
                                    key={user.id}
                                    className={`HomePageMessages_BottomResults ${selectedUsers.includes(user.id) ? "selected" : ""}`}
                                    onClick={() => toggleUserSelection(user.id, user.username, user.photoURL)}
                                >
                                    <Avatar src={user.photoURL} />
                                    <p>{user.username}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {handleSelectedFriend && (
                <div className='FriendMessages'>
                    <div className="FriendMessages_Top">
                        <div className='FriendMessages_TopLeft'>
                            <Avatar src={handleSelectedFriend.photoURL} />
                            <p>{handleSelectedFriend.username}</p>
                        </div>

                        <div className='FriendMessages_TopRight'>
                            <HorizontalRuleIcon />
                            <CloseIcon onClick={closeBox} />
                        </div>
                    </div>

                    <div className="FriendMessages_Middle">
                        <div className='friendIntro'>
                            <Avatar src={handleSelectedFriend.photoURL} />
                            <h3>{handleSelectedFriend.username}</h3>
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
        </>
    )
}

export default HomePage_Messages