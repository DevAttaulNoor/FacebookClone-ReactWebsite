import '../../CSS/FriendsPage/FriendsPage_Main_FriendReqs.css'
import React, { useEffect, useState } from "react";
import { db } from '../BackendRelated/Firebase'
import { useStateValue } from '../BackendRelated/StateProvider'

function FriendsPage_Main_FriendReqs() {
    const [{ user }] = useStateValue();
    const [friendRequests, setFriendRequests] = useState([]);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const friendRequestsCollection = db.collection("Users").doc(user.uid).collection("friendRequests");

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
                        receiverUid: data.receiverUid,
                    });
                });
                setFriendRequests(requests);
            } 
            
            catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        }
        fetchFriendRequests()
    }, [user.uid]);

    const acceptFriendRequest = async (friendRequestId, senderUid) => {
        try {
            // Check if the request is already being processed
            if (isRequestProcessing) {
                return;
            }

            setIsRequestProcessing(true); // Set a flag to indicate that the request is being processed

            const usersCollection = db.collection("Users");
            const currentUserDoc = usersCollection.doc(user.uid);

            // Check if the user is already a friend
            const currentUserFriendsQuery = await currentUserDoc
                .collection("Friends")
                .where("friendUid", "==", senderUid)
                .get();

            if (currentUserFriendsQuery.docs.length === 0) {
                // User is not already a friend, proceed to add them

                // Update the sender's "Friends" subcollection
                await usersCollection
                    .doc(senderUid)
                    .collection("Friends")
                    .add({
                        friendUid: user.uid,
                        // You can fetch other user details here using a similar approach
                    });

                // Update the current user's "Friends" subcollection
                await currentUserDoc
                    .collection("Friends")
                    .add({
                        friendUid: senderUid,
                        // You can fetch other user details here using a similar approach
                    });

                // Update the friend request's status to "accepted" in both the sender's and receiver's subcollections
                const senderFriendRequestsCollection = usersCollection
                    .doc(senderUid)
                    .collection("friendRequests");
                const receiverFriendRequestsCollection = currentUserDoc
                    .collection("friendRequests");

                await senderFriendRequestsCollection.doc(friendRequestId).update({
                    status: "accepted",
                });

                await receiverFriendRequestsCollection.doc(friendRequestId).update({
                    status: "accepted",
                });

                db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('FriendsReqs').doc(user.uid).update({
                    status: 'accepted',
                    timestamp: new Date(),
                });

                // After successfully accepting the friend request, update the state
                setFriendRequests((prevRequests) =>
                    prevRequests.filter((request) => request.id !== friendRequestId)
                );

                alert("Friend request accepted!");
            } else {
                alert("You are already friends with this user.");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        } finally {
            setIsRequestProcessing(false); // Reset the request processing flag
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

            db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('FriendsReqs').doc(user.uid).update({
                status: 'removed',
                timestamp: new Date(),
            });

            alert("Friend request rejected!");
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    return (
        <div className="friendspageMainReqs">
            <div className="friendspageMainReqs_top">
                <p>Friends Requests</p>
            </div>

            <div className="friendspageMainReqs_bottom">
                {friendRequests.map((request) => {
                    // Check if the request is for the current user
                    if (request.status !== "accepted" && request.receiverUid === user.uid) {
                        return (
                            <div key={request.id} className="friendsCard">
                                <div className="friendsCard_top">
                                    <img src={request.senderPhotoUrl} alt="" />
                                </div>
                                <div className="friendsCard_bottom">
                                    <p id="friendName">{request.senderName}</p>
                                    <p id="friendMutual">Mutual friends</p>
                                    {isRequestProcessing ? (
                                        <button disabled>Accepting...</button>
                                    ) : (
                                        <button onClick={() => acceptFriendRequest(request.id, request.senderUid)}>
                                            Accept
                                        </button>
                                    )}
                                    <button onClick={() => rejectFriendRequest(request.id, request.senderUid)}>Reject</button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );

}

export default FriendsPage_Main_FriendReqs;