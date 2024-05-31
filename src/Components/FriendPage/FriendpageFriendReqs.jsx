import '../../CSS/FriendPage/FriendpageFriendReqs.css';
import React, { useEffect, useState } from "react";
import { Avatar } from '@mui/material';
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
            if (isRequestProcessing) {
                return;
            }

            setIsRequestProcessing(true);

            const usersCollection = db.collection("Users");
            const currentUserDoc = usersCollection.doc(user.uid);

            const currentUserFriendsQuery = await currentUserDoc
                .collection("Friends")
                .where("friendUid", "==", senderUid)
                .get();

            if (currentUserFriendsQuery.docs.length === 0) {
                await usersCollection
                    .doc(senderUid)
                    .collection("Friends")
                    .add({
                        friendUid: user.uid,
                    });

                await currentUserDoc
                    .collection("Friends")
                    .add({
                        friendUid: senderUid,
                    });

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
                    timestamp: Math.floor(new Date().getTime() / 1000),
                });

                setFriendRequests((prevRequests) =>
                    prevRequests.filter((request) => request.id !== friendRequestId)
                );

                alert("Friend request accepted!");
                dispatch(setFriends(friendRequestId));
            } else {
                alert("You are already friends with this user.");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        } finally {
            setIsRequestProcessing(false);
        }
    };

    const rejectFriendRequest = async (friendRequestId, senderUid) => {
        try {
            const usersCollection = db.collection("Users");

            const senderFriendRequestsCollection = usersCollection
                .doc(senderUid)
                .collection("friendRequests");

            await senderFriendRequestsCollection.doc(friendRequestId).delete();

            const receiverFriendRequestsCollection = usersCollection
                .doc(user.uid)
                .collection("friendRequests");

            await receiverFriendRequestsCollection.doc(friendRequestId).delete();

            db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('FriendsReqs').doc(user.uid).update({
                status: 'removed',
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            alert("Friend request rejected!");
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.id !== friendRequestId)
            );
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
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };
        fetchFriendRequests();
    }, [user.uid]);

    return (
        <div className="friendpageFriendReqs">
            {friendRequests.length > 0 ? (
                <>
                    <div className="friendpageFriendReqsTop">
                        <p>Friend Requests</p>
                    </div>

                    <div className="friendpageFriendReqsBottom">
                        {friendRequests.map((request) => {
                            if (request.status !== "accepted" && request.receiverUid === user.uid) {
                                return (
                                    <div key={request.id} className="friendCard">
                                        <div className="friendCardTop">
                                            <Avatar src={request.senderPhotoUrl} />
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
                </>
            ) : (
                <div className="noReqsNote">
                    <h3>When you have friend requests or suggestions, you'll see them here.</h3>
                </div>
            )}
        </div>
    );
}

export default FriendpageFriendReqs;