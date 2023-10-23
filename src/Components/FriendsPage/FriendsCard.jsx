import '../../CSS/FriendsPage/FriendsCard.css';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../BackendRelated/Firebase';

function FriendsCard({ user }) {
    const [friendRequestStatus, setFriendRequestStatus] = useState("not_sent");
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);
    const currentUser = auth.currentUser;
    const senderUid = currentUser.uid;

    // Check if a request from the current user to this friend already exists
    useEffect(() => {
        const checkFriendRequestStatus = async () => {
            try {
                const userDocRef = db.collection('Users').doc(user.uid);
                const existingRequest = await userDocRef.collection('friendRequests')
                    .where('senderUid', '==', senderUid)
                    .where('receiverUid', '==', user.uid)
                    .get();

                if (!existingRequest.empty) {
                    const requestStatus = existingRequest.docs[0].data().status;
                    setFriendRequestStatus(requestStatus);
                }

                else {
                    setFriendRequestStatus("not_sent");
                }
            }

            catch (error) {
                console.error('Error checking friend request status:', error);
            }
        };
        checkFriendRequestStatus();
    }, [senderUid, user.uid]);

    const sendFriendRequest = async () => {
        try {
            if (friendRequestStatus === "not_sent" && !isRequestProcessing) {
                setIsRequestProcessing(true);

                const senderName = currentUser.displayName;
                const senderEmail = currentUser.email;
                const senderPhotoUrl = currentUser.photoURL;
                const userDocRef = db.collection('Users').doc(user.uid);
                const friendRequestId = db.collection('friendRequests').doc().id;

                // Send a new friend request to the receiver
                await userDocRef.collection('friendRequests').doc(friendRequestId).set({
                    senderUid: senderUid,
                    senderName: senderName,
                    senderEmail: senderEmail,
                    senderPhotoUrl: senderPhotoUrl,
                    receiverUid: user.uid,
                    receiverName: user.username,
                    receiverEmail: user.email,
                    status: 'pending',
                });

                // Also, create the same request in the sender's "friendRequests" subcollection
                const senderDocRef = db.collection('Users').doc(senderUid);
                await senderDocRef.collection('friendRequests').doc(friendRequestId).set({
                    senderUid: senderUid,
                    senderName: senderName,
                    senderEmail: senderEmail,
                    senderPhotoUrl: senderPhotoUrl,
                    receiverUid: user.uid,
                    receiverName: user.username,
                    receiverEmail: user.email,
                    status: 'pending',
                });

                setFriendRequestStatus("pending");
                alert('Friend request sent!');
            }
        } 
        
        catch (error) {
            console.error('Error sending friend request:', error);
        } 
        
        finally {
            setIsRequestProcessing(false);
        }
    };

    return (
        <div className='friendsCard'>
            <div className="friendsCard_top">
                <img src={user.photoURL} alt="" />
            </div>
            
            <div className="friendsCard_bottom">
                <p id="friendName">{user.username}</p>
                <p id="friendMutual">Mutual friends</p>
                {friendRequestStatus === "not_sent" && (
                    <button
                        id="addBtn"
                        onClick={sendFriendRequest}
                        disabled={isRequestProcessing}
                    >
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
    );
}

export default FriendsCard;