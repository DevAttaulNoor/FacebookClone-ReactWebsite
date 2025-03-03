import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@services/firebase";
import { useUsers } from './useUsers';

export const useFriends = (userId) => {
    const { usersExceptCurrent } = useUsers(userId);
    const [friends, setFriends] = useState([]);
    const [friendReqs, setFriendReqs] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptingFriends, setAcceptingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!usersExceptCurrent || usersExceptCurrent.length === 0) return;

        const friendsQuery = collection(db, 'Users', userId, 'Friends');

        const unsubscribeFriends = onSnapshot(
            friendsQuery,
            (snapshot) => {
                const allFriends = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFriendReqs(allFriends);

                // Filter pending friend requests
                const pendingReqs = allFriends.filter(data => data.status === 'pending');
                const ReqsPendingState = usersExceptCurrent.filter(data =>
                    pendingReqs.some(user => user.receiverUid === data.uid)
                );
                setPendingFriends(ReqsPendingState);

                // Filter accepting friend requests
                const ReqsAcceptingState = usersExceptCurrent.filter(data =>
                    pendingReqs.some(user => user.senderUid === data.uid)
                );
                setAcceptingFriends(ReqsAcceptingState);

                // Filter accepted friend requests
                const acceptedReqs = allFriends.filter(data => data.status === 'accepted');
                const ReqsAcceptedState = usersExceptCurrent.filter(data =>
                    acceptedReqs.some(user => user.id === data.uid)
                );
                setAcceptedFriends(ReqsAcceptedState);

                // Filter users to send friend requests
                const FriendsTobeMade = usersExceptCurrent.filter(data => {
                    // Include users who are not in any friend requests
                    const isNotInAnyFriendReq = !allFriends.some(user =>
                        user.receiverUid === data.uid || user.senderUid === data.uid
                    );

                    // Include users who have pending friend requests where the current user is the sender
                    const isPendingSender = pendingReqs.some(user =>
                        user.senderUid === userId && user.receiverUid === data.uid
                    );

                    return isNotInAnyFriendReq || isPendingSender;
                });
                setFriends(FriendsTobeMade);

                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeFriends();
        };
    }, [userId, usersExceptCurrent]);

    return { friends, friendReqs, pendingFriends, acceptingFriends, acceptedFriends, loading, error };
};