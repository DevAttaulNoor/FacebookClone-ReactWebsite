import '../../CSS/FriendPage/FriendpageFriendReqs.css';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import FriendCard from './FriendCard';

function FriendpageFriendReqs() {
    const user = useSelector((state) => state.data.user.user);
    const [friendRequests, setFriendRequests] = useState([]);

    const handleRequests = (requestId) => {
        setFriendRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== requestId)
        );
    };

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const querySnapshot = await db.collection("Users").doc(user.uid).collection("friendRequests").get();
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
            {(friendRequests.filter(reqs => (reqs.receiverUid === user.uid) && (reqs.status === 'pending'))).length > 0 ? (
                <>
                    <div className="friendpageFriendReqsTop">
                        <p>Friend Requests</p>
                    </div>

                    <div className="friendpageFriendReqsBottom">
                        {friendRequests.map((request) => (
                            (request.status !== "accepted" && request.receiverUid === user.uid) ? (
                                <FriendCard key={request.id} otherUser={request} requestsUpdated={handleRequests}/>
                            ) : (
                                null
                            )
                        ))}
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