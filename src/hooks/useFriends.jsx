import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useFriends = (userId) => {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const friendsQuery = collection(db, 'Users', userId, 'Friends');

        const unsubscribeFriends = onSnapshot(
            friendsQuery,
            (snapshot) => {
                const allFriends = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFriends(allFriends);

                // Filter pending and accepting friend requests
                const pendingReqs = allFriends.filter(data => data.status === 'pending');
                const acceptedReqs = allFriends.filter(data => data.status === 'accepted');

                setPendingFriends(pendingReqs);
                setAcceptedFriends(acceptedReqs);

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
    }, [userId]);

    return { friends, pendingFriends, acceptedFriends, loading, error };
};