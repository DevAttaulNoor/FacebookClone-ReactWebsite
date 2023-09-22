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
                // Create a reference to the "friendRequests" subcollection within the current user's document
                const friendRequestsCollection = db.collection("Users").doc(user.uid).collection("friendRequests");

                // Query the friendRequests subcollection
                const querySnapshot = await friendRequestsCollection.get();
                const requests = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    requests.push({
                        id: doc.id,
                        senderUid: data.senderUid,
                        senderName: data.senderName,
                        senderPhotoUrl: data.senderPhotoUrl,
                        status: data.status,
                    });
                });

                setFriendRequests(requests);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        }
        fetchFriendRequests()
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
                    // You can fetch other user details here using a similar approach
                });

            // Update the current user's "Friends" subcollection
            await usersCollection
                .doc(user.uid)
                .collection("Friends")
                .add({
                    friendUid: senderUid,
                    // You can fetch other user details here using a similar approach
                });

            // Update the friend request's status to "accepted" in both the sender's and receiver's subcollections
            const senderFriendRequestsCollection = usersCollection
                .doc(senderUid)
                .collection("friendRequests");
            const receiverFriendRequestsCollection = usersCollection
                .doc(user.uid)
                .collection("friendRequests");

            await senderFriendRequestsCollection.doc(friendRequestId).update({
                status: "accepted",
            });

            await receiverFriendRequestsCollection.doc(friendRequestId).update({
                status: "accepted",
            });

            alert("Friend request accepted!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const rejectFriendRequest = async (friendRequestId, senderUid) => {
        try {
            const usersCollection = db.collection("Users");

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

            alert("Friend request rejected!");
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    return (
        <div>
            Friends Requests
            {friendRequests.map((request) => {
                if (request.status !== "accepted") {
                    return (
                        <div key={request.id} className="friendsCard">
                            <div className="friendsCard_top">
                                <img src={request.senderPhotoUrl} alt="" />
                            </div>
                            <div className="friendsCard_bottom">
                                <p id="friendName">{request.senderName}</p>
                                <p id="friendMutual">Mutual friends</p>
                                <button onClick={() => acceptFriendRequest(request.id, request.senderUid)}>Accept</button>
                                <button onClick={() => rejectFriendRequest(request.id, request.senderUid)}>Reject</button>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );

}

export default FriendsPage_FriendsReqs;
