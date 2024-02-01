import '../../CSS/HomePage/HomePage_Messages.css'
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../BackendRelated/Firebase';
import { Avatar } from '@mui/material';
import { useStateValue } from '../BackendRelated/StateProvider';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function HomePage_Messages({ closeBox, handleMessageBox, closeFriendBox, handleSelectedFriend }) {
    const [{ user }] = useStateValue();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef(null);

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

    const sendMessage = async (recipientUserId, recipientUserName, recipientUserPhotoUrl) => {
        if (messageInput.trim() === '') {
            return;
        }

        if (!recipientUserId || !user.uid) {
            console.error('Recipient or sender is undefined');
            return;
        }

        const chatId = user.uid < recipientUserId
            ? `${user.uid}_${recipientUserId}`
            : `${recipientUserId}_${user.uid}`;

        const newMessage = {
            text: messageInput,
            sender: user.uid,
            senderName: user.username,
            senderPhotoUrl: user.photoURL,
            recipient: recipientUserId,
            recipientName: recipientUserName,
            recipientPhotoUrl: recipientUserPhotoUrl,
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
        } else {
            // If the chat document doesn't exist, create it with the new message
            await chatDocRef.set({ 
                senderUid: user.uid,
                recipientUid: recipientUserId,
                messages: [newMessage] 
            });
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

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker); // Toggle the state to show/hide the emoji picker
    };

    const handleEmojiClick = (event) => {
        setMessageInput((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
    };

    const toggleEmojiPickerBox = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setIsEmojiPickerVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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

    useEffect(() => {
        let chatId = null;
        if (selectedUsers[0] || handleSelectedFriend) {
            const userUid = user.uid;
            const friendUid = selectedUsers[0] ? selectedUsers[0].userId : handleSelectedFriend.friendUid;
            chatId = userUid < friendUid ? `${userUid}_${friendUid}` : `${friendUid}_${userUid}`;
        }

        if (chatId) {
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
    }, [selectedUsers, handleSelectedFriend, user.uid]);

    return (
        <>
            {handleMessageBox && (
                <div className='HomePageMessages'>
                    <div className="HomePageMessages_Top">
                        <div className='HomePageMessages_TopLeft'>
                            <p>New message</p>
                        </div>

                        <div className='HomePageMessages_TopRight'>
                            <HorizontalRuleIcon />
                            <CloseIcon onClick={closeBox} />
                        </div>
                    </div>

                    <div className="HomePageMessages_Middle">
                        <p id='toText'>To: </p>

                        <div className="HomePageMessages_MiddleRight">
                            {selectedUsers.length > 0 && (
                                <div className="selectedUserSection">
                                    {selectedUsers.map((userSelected) => (
                                        <div key={userSelected.userId} className="selectedUser">
                                            <p>{userSelected.username}</p>
                                            <CloseIcon onClick={() => deselectUser(userSelected.userId)} />
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
                        {searchText === '' ? (
                            <div className='selectedUserMessagingSection'>
                                <div className='selectedUserMessagingSection_Top'>
                                    <div className='selectedUserMessagingSection_TopTop'>
                                        {selectedUsers.map((userSelected) => (
                                            <>
                                                {selectedUsers.length >= 2 ? (
                                                    <div className="multiUserInfo" key={userSelected.userId}>
                                                        <Avatar src={userSelected.photoURL} />
                                                        <p>{userSelected.username}</p>
                                                    </div>
                                                ) : (
                                                    <div className="singleUserInfo" key={userSelected.userId}>
                                                        <Avatar src={userSelected.photoURL} />
                                                        <p>{userSelected.username}</p>
                                                    </div>
                                                )}
                                            </>
                                        ))}
                                    </div>

                                    <div className='selectedUserMessagingSection_TopBottom'>
                                        {messages.map((message) => (
                                            <div key={message.timestamp} className={`message ${message.sender === user.uid ? 'sent' : 'received'}`}>
                                                <p id='messageContent'>{message.text}</p>
                                                <p id='messageTimestamp'>{timeAgowithInitials(message.timestamp)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className='selectedUserMessagingSection_Bottom'>
                                    <AddCircleIcon />
                                    <div className='inputSection'>
                                        <input
                                            type='text'
                                            placeholder='Aa'
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                        />
                                        <EmojiEmotionsIcon className='emojiIcon' onClick={toggleEmojiPickerBox} ref={emojiPickerRef} />
                                    </div>
                                    {isEmojiPickerVisible && (
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    )}
                                    <SendIcon onClick={() => sendMessage(selectedUsers[0].userId, selectedUsers[0].username, selectedUsers[0].photoURL)} />
                                </div>
                            </div>
                        ) : (
                            <div className='searchedUserSection'>
                                {matchingUsernames.length !== 0 ? (
                                    matchingUsernames.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`searchedUserSectionInner ${selectedUsers.includes(user.id) ? "selected" : ""}`}
                                            onClick={() => toggleUserSelection(user.id, user.username, user.photoURL)}
                                        >
                                            <Avatar src={user.photoURL} />
                                            <p>{user.username}</p>
                                        </div>
                                    ))

                                ) : (
                                    <p id='noMatch'>No matches</p>
                                )}
                            </div>
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
                            <CloseIcon onClick={closeFriendBox} />
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
                            <EmojiEmotionsIcon className='emojiIcon' onClick={toggleEmojiPickerBox} ref={emojiPickerRef} />
                        </div>
                        {isEmojiPickerVisible && (
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        )}
                        <SendIcon onClick={() => sendMessage(handleSelectedFriend.friendUid, handleSelectedFriend.username, handleSelectedFriend.photoURL)} />
                    </div>
                </div>
            )}
        </>
    )
}

export default HomePage_Messages