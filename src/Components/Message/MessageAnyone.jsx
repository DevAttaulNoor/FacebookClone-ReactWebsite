import '../../CSS/Message/MessageAnyone.css'
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { db } from '../../Firebase/firebase';
import { timeAgoInitials } from "../../Assets/Utility/TimeModule";
import { setMsgAnyone, setMsgAnyoneBoxVisibility } from '../../Redux/messageSlice';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function MessageAnyone() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const msgAnyone = useSelector((state) => state.data.message.msgAnyone);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [searchText, setSearchText] = useState('');
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef(null);
    const messageContainerRef = useRef(null);

    const handleEmojiClick = (event) => {
        setMessageInput((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker); // Toggle the state to show/hide the emoji picker
    };

    const toggleEmojiPickerBox = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    const toggleUserSelection = (user) => {
        dispatch(setMsgAnyone(user));
        setSearchText('');
    };

    const closeMsgBox = () => {
        dispatch(setMsgAnyone(''));
        dispatch(setMsgAnyoneBoxVisibility(false));
    }

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
            recipient: recipientUserId,
            timestamp: Math.floor(new Date().getTime() / 1000),
        };

        // Retrieve the existing messages for the chat
        const chatDocRef = db.collection('Chats').doc(chatId);
        const chatDoc = await chatDocRef.get();

        if (chatDoc.exists) {
            setMessageInput('');

            const existingMessages = chatDoc.data().messages || [];
            const updatedMessages = [...existingMessages, newMessage];

            // Update the messages field in the document
            await chatDocRef.update({ messages: updatedMessages });
        } else {
            setMessageInput('');
            await chatDocRef.set({
                chatId: chatId,
                senderUid: user.uid,
                senderName: user.username,
                senderPhotoUrl: user.photoURL,
                recipientUid: recipientUserId,
                recipientName: recipientUserName,
                recipientPhotoUrl: recipientUserPhotoUrl,
                messages: [newMessage]
            });
        }
    };

    useEffect(() => {
        if (messageContainerRef.current) {
            const lastChild = messageContainerRef.current.lastChild;
            if (lastChild) {
                lastChild.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages]);

    useEffect(() => {
        if (searchText === '') {
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
                            uid: data.uid,
                            username: data.username,
                            photoURL: data.photoURL,
                        };
                    })
                    .filter((person) =>
                        person.username.toLowerCase().includes(searchText.toLowerCase()) &&
                        person.username !== user.username
                    );
                setMatchingUsernames(matchingUsernames);
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    }, [searchText, user.username]);

    useEffect(() => {
        let chatId = null;
        if (msgAnyone) {
            const userUid = user.uid;
            const friendUid = msgAnyone.uid;
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
    }, [msgAnyone, user.uid]);

    return (
        <div className='MessageAnyone'>
            <div className="MessageAnyoneTop">
                <div className="MessageAnyoneTopTop">
                    <p>New message</p>
                    <div className='MessageAnyoneTopTopRight'>
                        <HorizontalRuleIcon />
                        <CloseIcon onClick={closeMsgBox} />
                    </div>
                </div>

                <div className='MessageAnyoneTopBottom'>
                    <p id='toText'>To: </p>
                    <div className="MessageAnyoneTopBottomRight">
                        {msgAnyone && (
                            <div className="selectedUser">
                                <p>{msgAnyone.username}</p>
                                <CloseIcon onClick={() => dispatch(setMsgAnyone(''))} />
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
            </div>

            {searchText === '' ? (
                <>
                    {msgAnyone && (
                        <>
                            <div className="MessageAnyoneMiddle">
                                <div className='MessageAnyoneMiddleTop'>
                                    <Avatar src={msgAnyone.photoURL} />
                                    <h3>{msgAnyone.username}</h3>
                                    <p>Facebook</p>
                                </div>

                                <div className='MessageAnyoneMiddleBottom' ref={messageContainerRef}>
                                    {messages.map((message) => (
                                        <div key={message.timestamp} className={`message ${message.sender === user.uid ? 'sent' : 'received'}`}>
                                            <h5>{message.text}</h5>
                                            <p>{timeAgoInitials(message.timestamp)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="MessageAnyoneBottom">
                                <AddCircleIcon />
                                <div className='inputContainer'>
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
                                <SendIcon onClick={() => sendMessage(msgAnyone.uid, msgAnyone.username, msgAnyone.photoURL)} />
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className='searchingUserContainer'>
                    {matchingUsernames.length !== 0 ? (
                        matchingUsernames.map((user) => (
                            <div className='searchingUserContainerInner' key={user.id} onClick={() => toggleUserSelection(user)}>
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
    )
}

export default MessageAnyone