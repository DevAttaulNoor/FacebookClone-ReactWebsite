import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useStories = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Stories');
    const [userStories, setUserStories] = useState([]);

    useEffect(() => {
        if (userId && collectionData) {
            const currentUserStories = collectionData?.filter(story => story.uid === userId);
            setUserStories(currentUserStories);
        }
    }, [userId, collectionData]);

    return {
        stories: collectionData ? collectionData : null,
        userStories: userId ? userStories : null,
        loading,
        error
    };
};