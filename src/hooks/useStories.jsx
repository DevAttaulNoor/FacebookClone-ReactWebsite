import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useStories = (userId) => {
    const [stories, setStories] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeStories = onSnapshot(collection(db, 'Stories'), (snapshot) => {
            const allStories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const groupedStories = allStories.reduce((user, story) => {
                const existingGroup = user.find(group => group.uid === story.uid);

                if (existingGroup) {
                    existingGroup.stories.push(story);
                } else {
                    user.push({ uid: story.uid, stories: [story] });
                }

                return user;
            }, []);

            // Filter stories for the current user
            if (userId) {
                const currentUserStories = allStories.filter(story => story.uid === userId);
                setUserStories(currentUserStories);
            }

            // Group stories by uid
            setStories(groupedStories);
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