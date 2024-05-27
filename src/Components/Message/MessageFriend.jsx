import '../../CSS/Message/MessageFriend.css';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { db } from '../../Firebase/firebase';
import { setMsgFriendBoxVisibility } from '../../Redux/messageSlice';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function MessageFriend() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const msgFriend = useSelector((state) => state.data.message.msgFriend);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef(null);
    const messageContainerRef = useRef(null);

    const toggleEmojiPickerBox = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker); // Toggle the state to show/hide the emoji picker
    };

    const handleEmojiClick = (event) => {
        setMessageInput((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
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
            recipient: recipientUserId,
            timestamp: new Date(),
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
        if (messageContainerRef.current) {
            const lastChild = messageContainerRef.current.lastChild;
            if (lastChild) {
                lastChild.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages]);

    useEffect(() => {
        let chatId = null;
        if (msgFriend) {
            const userUid = user.uid;
            const friendUid = msgFriend.friendUid;
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
    }, [msgFriend, user.uid]);

    return (
        <div className='MessageFriend'>
            <div className="MessageFriend_Top">
                <div className='MessageFriend_TopLeft'>
                    <Avatar src={msgFriend.photoURL} />
                    <p>{msgFriend.username}</p>
                </div>

                <div className='MessageFriend_TopRight'>
                    <HorizontalRuleIcon />
                    <CloseIcon onClick={() => dispatch(setMsgFriendBoxVisibility(false))} />
                </div>
            </div>

            <div className="MessageFriend_Middle" ref={messageContainerRef}>
                <div className='friendIntro'>
                    <Avatar src={msgFriend.photoURL} />
                    <h3>{msgFriend.username}</h3>
                    <p>Facebook</p>
                    <p>You're friends on Facebook</p>
                </div>

                {messages.map((message) => (
                    <div key={message.timestamp} className={`message ${message.sender === user.uid ? 'sent' : 'received'}`}>
                        <h5>{message.text}</h5>
                        <p>{timeAgowithInitials(message.timestamp)}</p>
                    </div>
                ))}
            </div>

            <div className='MessageFriend_Bottom'>
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
                <SendIcon onClick={() => sendMessage(msgFriend.friendUid, msgFriend.username, msgFriend.photoURL)} />
            </div>
        </div>
    )
}

export default MessageFriend