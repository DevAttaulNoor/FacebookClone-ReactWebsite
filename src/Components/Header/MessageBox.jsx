import '../../CSS/Header/MessageBox.css';
import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { timeAgoInitials } from '../../Assets/Utility/TimeModule';
import { setChatNotiBoxVisible } from '../../Redux/notificationSlice';
import { setMsgFriend, setMsgFriendBoxVisibility } from '../../Redux/messageSlice';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function MessageBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const users = useSelector((state) => state.data.user.users);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const [activeButton, setActiveButton] = useState('Inbox');

    const handleCategory = (category) => {
        setActiveButton(category);
    };

    const handleMsgFriendBox = (friend) => {
        dispatch(setMsgFriend(friend));
        dispatch(setMsgFriendBoxVisibility(true));
        dispatch(setChatNotiBoxVisible(false));
    };

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
                        {chatNotification.map((chat) => {
                            const isUserSender = chat.senderUid === user.uid;
                            const isUserRecipient = chat.recipientUid === user.uid;
                            const friendId = isUserSender ? chat.recipientUid : chat.senderUid;
                            const friend = users.filter(friend => friend.uid === friendId);

                            if (isUserSender || isUserRecipient) {
                                const lastMessage = chat.messages.slice(-1)[0];

                                return (
                                    <div key={chat.chatId}>
                                        {activeButton === 'Inbox' && (
                                            <div className='messageBoxBottomOption' onClick={() => handleMsgFriendBox(friend[0])}>
                                                <Avatar src={isUserSender ? chat.recipientPhotoUrl : chat.senderPhotoUrl} />
                                                <div className='messageBoxBottomOptionContent'>
                                                    <p>{isUserSender ? chat.recipientName : chat.senderName}</p>
                                                    <div className='messageBoxBottomOptionContentBottom'>
                                                        <span>{lastMessage.text}</span>
                                                        <p> · </p>
                                                        <h5>{timeAgoInitials(lastMessage.timestamp)}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
        </div>
    );
}

export default MessageBox;