import '../../CSS/FriendPage/FriendpageFriendReqs.css'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setFriends } from '../../Redux/friendSlice';

function FriendpageFriendReqs() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [friendRequests, setFriendRequests] = useState([]);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);
    
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
                dispatch(setFriends(friendRequestId))
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

    return (
        <div className="friendpageFriendReqs">
            <div className="friendpageFriendReqsTop">
                <p>Friends Requests</p>
            </div>

            <div className="friendpageFriendReqsBottom">
                {friendRequests.map((request) => {
                    if (request.status !== "accepted" && request.receiverUid === user.uid) {
                        return (
                            <div key={request.id} className="friendCard">
                                <div className="friendCardTop">
                                    <img src={request.senderPhotoUrl} alt="" />
                                </div>
                                <div className="friendCardBottom">
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

export default FriendpageFriendReqs;