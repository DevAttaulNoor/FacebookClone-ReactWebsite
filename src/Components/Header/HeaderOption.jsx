import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setChatNotification, setNotification } from '../../Redux/notificationSlice';
import HeaderNormal from './HeaderNormal';
import HeaderTransformed from './HeaderTransformed';

function HeaderOption() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const selectedReel = useSelector((state) => state.data.reel.selectedReel);
    const pathsToHideHeader = [`/reelpage/${selectedReel}`, '/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

    useEffect(() => {
        const handleSnapshot = (snapshot, type) => {
            return snapshot.docs.map(doc => ({ ...doc.data(), type }));
        };

        const likesRef = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Likes');
        const commentsRef = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Comments');
        const friendReqsRef = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('FriendsReqs');

        // Create listeners for each collection
        const likesListener = likesRef.onSnapshot(snapshot => {
            const likes = handleSnapshot(snapshot, 'like');
            updateNotifications(likes);
        });

        const commentsListener = commentsRef.onSnapshot(snapshot => {
            const comments = handleSnapshot(snapshot, 'comment');
            updateNotifications(comments);
        });

        const friendReqsListener = friendReqsRef.onSnapshot(snapshot => {
            const friendReqs = handleSnapshot(snapshot, 'friendReq');
            updateNotifications(friendReqs);
        });

        let allNotifications = [];

        const updateNotifications = (newData) => {
            allNotifications = [...allNotifications.filter(item => item.type !== newData[0]?.type), ...newData];
            allNotifications.sort((a, b) => b.timestamp - a.timestamp);
            dispatch(setNotification(allNotifications));
        };

        // Clean up the listeners when the component unmounts
        return () => {
            likesListener();
            commentsListener();
            friendReqsListener();
        };
    }, [user.uid, dispatch]);

    useEffect(() => {
        const chatListener = db.collection('Chats').onSnapshot(snapshot => {
            const chatsData = [];
            snapshot.forEach(doc => {
                const chatData = doc.data();
                const messagesData = chatData.messages || [];
                chatData.messages = messagesData;
                chatsData.push(chatData);
            });

            const relevantChats = chatsData
                .map(chat => (chat.recipientUid === user.uid || chat.senderUid === user.uid) ? chat : null)
                .filter(Boolean);

            dispatch(setChatNotification(relevantChats));
        }, error => {
            console.error('Error fetching chat data:', error);
            dispatch(setChatNotification([]));
        });

        // Clean up the listener when the component unmounts
        return () => {
            chatListener();
        };
    }, [user.uid, dispatch]);

    return (
        <>
            {showHeader ? (
                <HeaderNormal />
            ) : (
                <HeaderTransformed />
            )}
        </>
    );
}

export default HeaderOption