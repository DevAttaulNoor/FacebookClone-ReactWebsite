import "../CSS/FriendsCard.css"
import React from 'react'
import { auth, db } from "./Firebase";

function FriendsCard({ user }) {

    const sendFriendRequest = async () => {
        try {
            const currentUser = auth.currentUser;
            const senderUid = currentUser.uid;
            const senderName = currentUser.displayName;
            const senderEmail = currentUser.email;

            const userDocRef = db.collection('Users').doc(user.uid); // Receiver's document reference

            // Check if a request from the current user to this friend already exists
            const existingRequest = await userDocRef.collection('friendRequests')
                .where('senderUid', '==', senderUid)
                .get();

            if (existingRequest.empty) {
                // Send a new friend request to the receiver
                await userDocRef.collection('friendRequests').add({
                    senderUid: senderUid,
                    senderName: senderName,
                    senderEmail: senderEmail,
                    receiverUid: user.uid,
                    receiverName: user.username,
                    receiverEmail: user.email,
                    status: 'pending',
                });

                // Also, create the same request in the sender's "friendRequests" subcollection
                const senderDocRef = db.collection('Users').doc(senderUid);
                await senderDocRef.collection('friendRequests').add({
                    senderUid: senderUid,
                    senderName: senderName,
                    senderEmail: senderEmail,
                    receiverUid: user.uid,
                    receiverName: user.username,
                    receiverEmail: user.email,
                    status: 'pending',
                });

                alert('Friend request sent!');
            } else {
                alert('Friend request already sent!');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
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
                <button id="addBtn" onClick={sendFriendRequest}>Add friend</button>
                <button id="removeBtn">Remove</button>
            </div>
        </div>
    );
}

export default FriendsCard;