import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useReels = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Reels');
    const [userReels, setUserReels] = useState([]);

    useEffect(() => {
        if (userId && collectionData) {
            const currentUserReels = collectionData?.filter(reel => reel.uid === userId);
            setUserReels(currentUserReels);
        }
    }, [userId, collectionData]);

    return {
        reels: collectionData ? collectionData : null,
        userReels: userId ? userReels : null,
        loading,
        error
    };
};