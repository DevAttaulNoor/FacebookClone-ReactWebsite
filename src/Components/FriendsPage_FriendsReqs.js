import "../CSS/FriendsCard.css";
import "../CSS/FriendsPage_FriendsReqs.css";
import React, { useEffect, useState } from "react";
import { db } from "./Firebase";
import { useStateValue } from "./StateProvider";

function FriendsPage_FriendsReqs() {
    const [{ user }, dispatch] = useStateValue();
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                // Create a reference to the current user's document in the "Users" collection
                const currentUserDocRef = db.collection("Users").doc(user.uid);

                // Create a reference to the "friendRequests" subcollection within the current user's document
                const friendRequestsCollection = currentUserDocRef.collection("friendRequests");

                // Query the friendRequests subcollection
                const querySnapshot = await friendRequestsCollection.get();

                const requests = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    requests.push({
                        id: doc.id,
                        senderUid: data.senderUid,
                        // senderName: data.senderName,
                        // senderEmail: data.senderEmail,
                        // Add other relevant fields from the friend request document
                    });
                });

                setFriendRequests(requests);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };

        fetchFriendRequests();
    }, [user.uid]);

    const acceptFriendRequest = async (friendRequestId, senderUid) => {
        try {
            const usersCollection = db.collection("Users");

            // Update the sender's "Friends" subcollection
            await usersCollection
                .doc(senderUid)
                .collection("Friends")
                .add({
                    friendUid: user.uid,
                    // friendName: user.username,
                    // friendEmail: user.email,
                    // You can fetch other user details here using a similar approach
                });

            // Update the current user's "Friends" subcollection
            await usersCollection
                .doc(user.uid)
                .collection("Friends")
                .add({
                    friendUid: senderUid,
                    // friendName: senderName, // Assuming senderName is defined somewhere
                    // friendEmail: senderEmail, // Assuming senderEmail is defined somewhere
                    // You can fetch other user details here using a similar approach
                });

            // Delete the friend request from the sender's "friendRequests" subcollection
            const senderFriendRequestsCollection = usersCollection
                .doc(senderUid)
                .collection("friendRequests");

            await senderFriendRequestsCollection.doc(friendRequestId).delete();

            // Delete the friend request from the receiver's "friendRequests" subcollection
            const receiverFriendRequestsCollection = usersCollection
                .doc(user.uid)
                .collection("friendRequests");

            await receiverFriendRequestsCollection.doc(friendRequestId).delete();

            alert("Friend request accepted!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };


    const rejectFriendRequest = async (friendRequestId) => {
        try {
            // Delete the friend request from the "friendRequests" subcollection
            const friendRequestsCollection = db
                .collection("Users")
                .doc(user.uid)
                .collection("friendRequests");

            await friendRequestsCollection.doc(friendRequestId).delete();

            alert("Friend request rejected!");
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    return (
        <div>
            Friends Requests
            {friendRequests.map((request) => (
                <div key={request.id} className="friendsCard">
                    <div className="friendsCard_top">
                        {/* Display sender's profile picture and other details */}
                        <p>Sender Name: {request.senderName}</p>
                        {console.log(request.senderName)}
                    </div>
                    <div className="friendsCard_bottom">
                        <button onClick={() => acceptFriendRequest(request.id, request.senderUid)}>
                            Accept
                        </button>
                        <button onClick={() => rejectFriendRequest(request.id)}>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FriendsPage_FriendsReqs;
