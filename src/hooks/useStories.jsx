import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@services/firebase";

export const useStories = (userId) => {
    const [stories, setStories] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeStories = onSnapshot(collection(db, 'Stories'), (snapshot) => {
            const allStories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStories(allStories);

            // Filter stories for the current user
            if (userId) {
                const currentUserStories = allStories.filter(story => story.uid === userId);
                setUserStories(currentUserStories);
            }

            setLoading(false);
        },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeStories();
        };
    }, [userId]);

    return { stories, userStories, loading, error };
};