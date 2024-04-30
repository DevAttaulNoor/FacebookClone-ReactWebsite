import '../../CSS/UniversalComponent/MessageBox.css'
import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomepageMessage from '../HomePage/HomepageMessage';
import { setChatNotiBoxVisible, setChatNotification } from '../../Redux/notificationSlice';

function MessageBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friendsData = useSelector((state) => state.data.friends.friendsData);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const [chats, setChats] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState();
    const [friendMessageBox, setFriendMessageBox] = useState(false);
    const [activeButton, setActiveButton] = useState('Inbox');

    const openFriendMessageBox = (friend) => {
        setSelectedFriend(friend);
        setFriendMessageBox(true);
    };

    const closeFriendMessageBox = () => {
        setSelectedFriend(null);
        setFriendMessageBox(false);
    }

    const handleCategory = (category) => {
        setActiveButton(category);
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
        const fetchData = async () => {
            try {
                const querySnapshot = await db.collection('Chats').get();

                if (!querySnapshot.empty) {
                    const chatsData = [];

                    querySnapshot.forEach(doc => {
                        const chatData = doc.data();
                        // Retrieve the messages list from the chatData
                        const messagesData = chatData.messages || []; // Ensure messagesData is an array
                        chatData.messages = messagesData;
                        chatsData.push(chatData);
                    });

                    setChats(chatsData);
                } else {
                    setChats([]);
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setChats([]);
            }
        };
        fetchData();

    }, [user.uid]);

    useEffect(() => {
        const relevantChats = chats
            .map(chat => (chat.recipientUid === user.uid || chat.senderUid === user.uid) ? chat : null)
            .filter(Boolean);

        dispatch(setChatNotification(relevantChats))
    }, [chats, user.uid]);

    return (
        <div className="messageBox" onClick={(e) => e.stopPropagation()}>
            <div className='messageBoxTop'>
                <div className='messageBoxTopTop'>
                    <h3>Chats</h3>
                    <MoreHorizIcon />
                </div>

                <div className='messageBoxTopBottom'>
                    <SearchIcon />
                    <input type="text" name="" id="" placeholder='Search Messenger' />
                </div>
            </div>

            <div className='messageBoxMiddle'>
                <button className={activeButton === 'Inbox' ? 'active' : ''} onClick={() => handleCategory('Inbox')}>Inbox</button>
                <button className={activeButton === 'Communities' ? 'active' : ''} onClick={() => handleCategory('Communities')}>Communities</button>
            </div>

            <div className='messageBoxBottom'>
                {chatNotification.length > 0 ? (
                    <>
                        {chats.map((chat, index) => {
                            const isUserSender = chat.senderUid === user.uid;
                            const isUserRecipient = chat.recipientUid === user.uid;
                            const friendId = isUserSender ? chat.recipientUid : chat.senderUid;
                            const friend = friendsData.filter(friend => friend.friendUid === friendId);

                            if (isUserSender || isUserRecipient) {
                                const lastMessage = chat.messages.slice(-1)[0];
                                const isSender = lastMessage.sender !== user.uid;

                                return (
                                    <>
                                        {activeButton === 'Inbox' ? (
                                            <div className='messageBoxBottomOption' key={index} onClick={() => openFriendMessageBox(friend[0])}>
                                                <Avatar src={isSender ? lastMessage.senderPhotoUrl : lastMessage.recipientPhotoUrl} />
                                                <div className='messageBoxBottomOptionContent'>
                                                    <p>{isSender ? lastMessage.senderName : lastMessage.recipientName}</p>
                                                    <div className='messageBoxBottomOptionContentBottom'>
                                                        <span>{lastMessage.text}</span>
                                                        <p> · </p>
                                                        <h5>{timeAgowithInitials(lastMessage.timestamp)}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </>
                                );
                            }
                            return null;
                        })}
                        {activeButton === 'Communities' && (
                            <p id='noMsg'>No communities message found.</p>
                        )}
                    </>
                ) : (
                    <p id='noMsg'>No messages found.</p>
                )}
            </div>

            <HomepageMessage handleSelectedFriend={selectedFriend} closeFriendBox={closeFriendMessageBox} />
        </div>
    );
}

export default MessageBox