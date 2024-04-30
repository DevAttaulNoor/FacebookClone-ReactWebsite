import '../../CSS/UniversalComponent/NotificationBox.css'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPost } from '../../Redux/postSlice';
import { db } from '../../Firebase/firebase';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { setNotiBoxVisible, setNotification } from '../../Redux/notificationSlice';

function NotificationBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const notSeenNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const [activeButton, setActiveButton] = useState('All');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const handleNotificationClicked = async (id, type) => {
        try {
            await db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection(type).doc(id).update({
                notificationStatus: 'seen',
            });
            dispatch(setSelectedPost(id));
        } catch (error) {
            console.error("Error updating notification status: ", error);
        }

        dispatch(setNotiBoxVisible(false));
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

    useEffect(() => {
        const likesData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Likes');
        const commentData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Comments');
        const friendReqData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('FriendsReqs');

        // Use Promise.all to wait for all promises to resolve
        Promise.all([
            likesData.get(),
            commentData.get(),
            friendReqData.get(),
        ]).then((results) => {
            const likes = results[0].docs.map((doc) => doc.data());
            const comments = results[1].docs.map((doc) => doc.data());
            const friendReqs = results[2].docs.map((doc) => doc.data());

            // Combine data from all collections
            const notification = [...likes, ...comments, ...friendReqs];

            // Sort the combined array based on timestamps in ascending order
            notification.sort((a, b) => b.timestamp - a.timestamp);
            dispatch(setNotification(notification))

            // Set the combined and sorted data to your state
            // setNotifications(notifications);
        }).catch((error) => {
            console.error('Error fetching notifications:', error);
        });
    }, [user.uid]);

    return (
        <div className="notificationBox" onClick={(e) => e.stopPropagation()}>
            <div className='notificationBoxTop'>
                <h3>Notifications</h3>
                <MoreHorizIcon />
            </div>

            <div className='notificationBoxMiddle'>
                <button className={activeButton === 'All' ? 'active' : ''} onClick={() => handleButtonClick('All')}>All</button>
                <button className={activeButton === 'Unread' ? 'active' : ''} onClick={() => handleButtonClick('Unread')}>Unread</button>
            </div>

            <div className='notificationBoxBottom'>
                {notification.length > 0 ? (
                    <>
                        {activeButton === 'All' ? (
                            <div className='notificationBoxBottomOptions'>
                                {notification.map((notification, index) => (
                                    <>
                                        {notification.status === 'reacted' && (
                                            <div className='notificationBoxBottomOption' key={index}>
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
                                            <div className='notificationBoxBottomOption' key={index}>
                                                <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.commentid, "Comments")}>
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

                                        {notification.status === 'sent' && (
                                            <div className='notificationBoxBottomOption' key={index}>
                                                <div className='notificationBoxBottomOption_Left'>
                                                    <Avatar src={notification.senderPhotoUrl} />
                                                </div>
                                                <div className="notificationBoxBottomOption_Right">
                                                    <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                    <h5>{timeAgo(notification.timestamp)}</h5>
                                                    <div className="notificationBoxBottomOption_RightBottom">
                                                        <button id='confbtn'>Confirm</button>
                                                        <button id='delbtn'>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
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
                                                <>
                                                    {notification.status === 'reacted' && (
                                                        <div className='notificationBoxBottomOption' key={index}>
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
                                                        <div className='notificationBoxBottomOption' key={index}>
                                                            <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.commentid, "Comments")}>
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

                                                    {notification.status === 'sent' && (
                                                        <div className='notificationBoxBottomOption' key={index}>
                                                            <div className='notificationBoxBottomOption_Left'>
                                                                <Avatar src={notification.senderPhotoUrl} />
                                                            </div>
                                                            <div className="notificationBoxBottomOption_Right">
                                                                <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                                <h5>{timeAgo(notification.timestamp)}</h5>
                                                                <div className="notificationBoxBottomOption_RightBottom">
                                                                    <button id='confbtn'>Confirm</button>
                                                                    <button id='delbtn'>Delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
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