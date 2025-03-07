import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useStories = (userId) => {
    const [stories, setStories] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [groupedStories, setGroupedStories] = useState({});
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

                // Group stories by uid
                const grouped = allStories.reduce((acc, story) => {
                    // Find if the uid already exists in the accumulator array
                    const existingGroup = acc.find(group => group.uid === story.uid);

                    if (existingGroup) {
                        // If the uid exists, push the story into its stories array
                        existingGroup.stories.push(story);
                    } else {
                        // If the uid doesn't exist, create a new group object
                        acc.push({ uid: story.uid, stories: [story] });
                    }

                    return acc;
                }, []);

                setGroupedStories(grouped);
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

    return { stories, userStories, groupedStories, loading, error };
};