import '../../CSS/FriendPage/FriendCard.css'
import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setFriends } from '../../Redux/friendSlice';

function FriendCard({ otherUser, requestsUpdated}) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.data.user.user);
    const [acceptingRequests, setAcceptingRequests] = useState({});
    const [rejectingRequests, setRejectingRequests] = useState({});
    const [friendRequestStatus, setFriendRequestStatus] = useState('');
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);

    const sendFriendRequest = async () => {
        try {
            if (friendRequestStatus === '' && !isRequestProcessing) {
                setIsRequestProcessing(true);
                const friendRequestId = db.collection('friendRequests').doc().id;

                // Common friend request data
                const friendRequestData = {
                    requestId: friendRequestId,
                    senderUid: user.uid,
                    senderName: user.username,
                    senderEmail: user.email,
                    senderPhotoUrl: user.photoURL,
                    receiverUid: otherUser.uid,
                    receiverName: otherUser.username,
                    receiverEmail: otherUser.email,
                    status: 'pending',
                };

                // Notification data
                const notificationData = {
                    ...friendRequestData,
                    receiverPhotoUrl: otherUser.photoURL,
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    status: 'sent',
                    notificationStatus: 'notseen',
                };

                // Send a new friend request to the receiver
                await db.collection('Users').doc(otherUser.uid).collection('friendRequests').doc(friendRequestId).set(friendRequestData);

                // Also, create the same request in the sender's "friendRequests" subcollection
                await db.collection('Users').doc(user.uid).collection('friendRequests').doc(friendRequestId).set(friendRequestData);

                // Add notification
                await db.collection("Users").doc(otherUser.uid).collection("Notifications").doc(otherUser.uid).collection('FriendsReqs').doc(friendRequestId).set(notificationData);

                setFriendRequestStatus("pending");
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setIsRequestProcessing(false);
        }
    };

    const acceptFriendRequest = async (friendRequestId, senderUid) => {
        try {
            if (acceptingRequests[friendRequestId]) {
                return;
            }

            setAcceptingRequests(prev => ({ ...prev, [friendRequestId]: true }));

            const currentUserFriendsQuery = await db.collection("Users").doc(user.uid).collection("Friends").where("friendUid", "==", senderUid).get();

            if (currentUserFriendsQuery.docs.length === 0) {
                await db.collection("Users").doc(senderUid).collection("Friends").add({
                    friendUid: user.uid,
                });

                await db.collection("Users").doc(user.uid).collection("Friends").add({
                    friendUid: senderUid,
                });

                await db.collection("Users").doc(senderUid).collection("friendRequests").doc(friendRequestId).update({
                    status: "accepted",
                    notificationStatus: 'seen',
                });

                await db.collection("Users").doc(user.uid).collection("friendRequests").doc(friendRequestId).update({
                    status: "accepted",
                    notificationStatus: 'seen',
                });

                db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('FriendsReqs').doc(friendRequestId).update({
                    status: 'accepted',
                    notificationStatus: 'seen',
                    timestamp: Math.floor(new Date().getTime() / 1000),
                });
                
                dispatch(setFriends(senderUid));
            }

            else {
                alert("You are already friends with this user.");
            }
            requestsUpdated(friendRequestId);
        }

        catch (error) {
            console.error("Error accepting friend request:", error);
        }

        finally {
            setAcceptingRequests(prev => ({ ...prev, [friendRequestId]: false }));
        }
    };

    const rejectFriendRequest = async (friendRequestId, senderUid) => {
        try {
            if (rejectingRequests[friendRequestId]) {
                return;
            }

            setRejectingRequests(prev => ({ ...prev, [friendRequestId]: true }));

            await db.collection("Users").doc(senderUid).collection("friendRequests").doc(friendRequestId).delete();
            await db.collection("Users").doc(user.uid).collection("friendRequests").doc(friendRequestId).delete();
            
            db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('FriendsReqs').doc(friendRequestId).update({
                status: 'removed',
                notificationStatus: 'seen',
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            requestsUpdated(friendRequestId);
        }

        catch (error) {
            console.error("Error rejecting friend request:", error);
        }

        finally {
            setRejectingRequests(prev => ({ ...prev, [friendRequestId]: false }));
        }
    };

    // Check if a request from the current user to this friend already exists
    useEffect(() => {
        const checkFriendRequestStatus = async () => {
            try {
                if (user?.uid && otherUser?.uid) {
                    const existingRequest = await db.collection('Users').doc(otherUser.uid).collection('friendRequests')
                        .where('senderUid', '==', user.uid)
                        .where('receiverUid', '==', otherUser.uid)
                        .get();

                    if (!existingRequest.empty) {
                        const requestStatus = existingRequest.docs[0].data().status;
                        setFriendRequestStatus(requestStatus);
                    } else {
                        setFriendRequestStatus('');
                    }
                }
            } catch (error) {
                console.error('Error checking friend request status:', error);
            }
        };
        checkFriendRequestStatus();
    }, [user?.uid, otherUser?.uid]);

    return (
        <div className='friendCard'>
            {otherUser.uid ? (
                <>
                    <div className="friendCardTop">
                        <Avatar src={otherUser.photoURL} />
                    </div>

                    <div className="friendCardContent">
                        <p id="friendName">{otherUser.username}</p>

                        <div className='friendCardContentBottom'>
                            {friendRequestStatus === '' && (
                                <button id="addBtn" onClick={sendFriendRequest} disabled={isRequestProcessing}>
                                    Add friend
                                </button>
                            )}

                            {friendRequestStatus === "pending" && (
                                <button id="pendingBtn" disabled>
                                    Pending
                                </button>
                            )}

                            <button id="removeBtn">Remove</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="friendCardTop">
                        <Avatar src={otherUser.senderPhotoUrl} />
                    </div>

                    <div className="friendCardContent">
                        <p id="friendName">{otherUser.senderName}</p>

                        <div className='friendCardContentBottom'>
                            {acceptingRequests[otherUser.id] ? (
                                <button id='acceptingBtn' disabled>Accepting</button>
                            ) : (
                                <button id='acceptBtn' onClick={() => acceptFriendRequest(otherUser.id, otherUser.senderUid)}>Accept</button>
                            )}

                            {rejectingRequests[otherUser.id] ? (
                                <button id='rejectingBtn' disabled>Rejecting</button>
                            ) : (
                                <button id='rejectBtn' onClick={() => rejectFriendRequest(otherUser.id, otherUser.senderUid)}>Reject</button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default FriendCard;