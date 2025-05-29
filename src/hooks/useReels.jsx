import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useReels = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Reels');
    const [userReels, setUserReels] = useState([]);

    useEffect(() => {
        if (collectionData && userId) {
            setUserReels(collectionData?.filter(reel => reel.uid === userId));
        }
    }, [userId, collectionData]);

    return {
        reels: collectionData ? collectionData : null,
        userReels: userId ? userReels : null,
        reelsLoading: loading,
        reelsError: error
    };
};