import '../../CSS/Header/NotificationBox.css';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { db } from '../../Firebase/firebase';
import { timeAgo } from '../../Assets/Utility/TimeModule';
import { setSelectedPost } from '../../Redux/postSlice';
import { setNotiBoxVisible } from '../../Redux/notificationSlice';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function NotificationBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const notSeenNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const [activeButton, setActiveButton] = useState('All');

    const handleCategory = (category) => {
        setActiveButton(category);
    };

    const handleNotificationClicked = async (id, type) => {
        try {
            const notificationRef = db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection(type).doc(id);
            const notificationDoc = await notificationRef.get();

            if (notificationDoc.exists) {
                const { notificationStatus } = notificationDoc.data();

                // Check if notificationStatus is not already 'seen'
                if (notificationStatus === 'notseen') {
                    await notificationRef.update({
                        notificationStatus: 'seen',
                    });
                }
            }

            dispatch(setSelectedPost(id));
        } catch (error) {
            console.error("Error updating notification status: ", error);
        }

        dispatch(setNotiBoxVisible(false));
    };

    return (
        <div className="notificationBox" onClick={(e) => e.stopPropagation()}>
            <div className='notificationBoxTop'>
                <h3>Notifications</h3>
                <MoreHorizIcon />
            </div>

            <div className='notificationBoxMiddle'>
                <button className={activeButton === 'All' ? 'active' : ''} onClick={() => handleCategory('All')}>All</button>
                <button className={activeButton === 'Unread' ? 'active' : ''} onClick={() => handleCategory('Unread')}>Unread</button>
            </div>

            <div className='notificationBoxBottom'>
                {notification.length > 0 ? (
                    <>
                        {activeButton === 'All' ? (
                            <div className='notificationBoxBottomOptions'>
                                {notification.map((notification, index) => (
                                    <div key={index}>
                                        {notification.status === 'reacted' && (
                                            <div className='notificationBoxBottomOption'>
                                                <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Likes")}>
                                                    <div className='notificationBoxBottomOption_Left'>
                                                        <Avatar src={notification.userphotoUrl} />
                                                    </div>
                                                    <div className="notificationBoxBottomOption_Right">
                                                        <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                        <h5>{timeAgo(notification.timestamp)}</h5>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )}

                                        {notification.status === 'commented' && (
                                            <div className='notificationBoxBottomOption'>
                                                <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Comments")}>
                                                    <div className='notificationBoxBottomOption_Left'>
                                                        <Avatar src={notification.userphotoUrl} />
                                                    </div>
                                                    <div className="notificationBoxBottomOption_Right">
                                                        <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                        <h5>{timeAgo(notification.timestamp)}</h5>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )}

                                        {(notification.status === 'sent' || notification.status === 'accepted' || notification.status === 'removed') && (
                                            <div className='notificationBoxBottomOption'>
                                                <NavLink to={`/friendReqs}`} onClick={() => handleNotificationClicked(notification.friendRequestId, "FriendsReqs")}>
                                                    <div className='notificationBoxBottomOption_Left'>
                                                        <Avatar src={notification.senderPhotoUrl} />
                                                    </div>
                                                    <div className="notificationBoxBottomOption_Right">
                                                        <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                        <h5>{timeAgo(notification.timestamp)}</h5>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {notSeenNotification.length === 0 ? (
                                    <p id='noNoti'>No unread notifications found.</p>
                                ) : (
                                    <div className='notificationBoxBottomOptions'>
                                        {notification
                                            .filter(notification => notification.notificationStatus === 'notseen')
                                            .map((notification, index) => (
                                                <div key={index}>
                                                    {notification.status === 'reacted' && (
                                                        <div className='notificationBoxBottomOption'>
                                                            <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Likes")}>
                                                                <div className='notificationBoxBottomOption_Left'>
                                                                    <Avatar src={notification.userphotoUrl} />
                                                                </div>
                                                                <div className="notificationBoxBottomOption_Right">
                                                                    <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                                    <h5>{timeAgo(notification.timestamp)}</h5>
                                                                </div>
                                                            </NavLink>
                                                        </div>
                                                    )}

                                                    {notification.status === 'commented' && (
                                                        <div className='notificationBoxBottomOption'>
                                                            <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Comments")}>
                                                                <div className='notificationBoxBottomOption_Left'>
                                                                    <Avatar src={notification.userphotoUrl} />
                                                                </div>
                                                                <div className="notificationBoxBottomOption_Right">
                                                                    <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                                    <h5>{timeAgo(notification.timestamp)}</h5>
                                                                </div>
                                                            </NavLink>
                                                        </div>
                                                    )}

                                                    {(notification.status === 'sent' || notification.status === 'accepted' || notification.status === 'removed') && (
                                                        <div className='notificationBoxBottomOption'>
                                                            <NavLink to={`/friendReqs}`} onClick={() => handleNotificationClicked(notification.friendRequestId, "FriendsReqs")}>
                                                                <div className='notificationBoxBottomOption_Left'>
                                                                    <Avatar src={notification.senderPhotoUrl} />
                                                                </div>
                                                                <div className="notificationBoxBottomOption_Right">
                                                                    <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                                    <h5>{timeAgo(notification.timestamp)}</h5>
                                                                </div>
                                                            </NavLink>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p id='noNoti'>No notifications found.</p>
                )}
            </div>
        </div>
    )
}

export default NotificationBox