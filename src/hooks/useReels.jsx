import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@services/firebase";

export const useReels = (userId) => {
    const [reels, setReels] = useState([]);
    const [userReels, setUserReels] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeReels = onSnapshot(collection(db, 'Reels'), (snapshot) => {
            const allReels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReels(allReels);

            // Filter stories for the current user
            if (userId) {
                const currentUserReels = allReels.filter(story => story.uid === userId);
                setUserReels(currentUserReels);
            }

            setLoading(false);
        },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeReels();
        };
    }, [userId]);

    return { reels, userReels, loading, error };
}
