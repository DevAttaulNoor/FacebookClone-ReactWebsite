import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useStories = (userId) => {
    const [stories, setStories] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storiesQuery = collection(db, 'Stories');

        const unsubscribeStories = onSnapshot(
            storiesQuery,
            (snapshot) => {
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