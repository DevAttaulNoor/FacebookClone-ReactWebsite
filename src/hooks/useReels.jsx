import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@services/firebase";
import { useCollectionData } from "./useDataCollection";

export const useReels = (userId) => {
    const { collectionData, loading, error } = useCollectionData("Reels");
    const [reels, setReels] = useState([]);
    const [userReels, setUserReels] = useState([]);

    useEffect(() => {
        if (collectionData) {
            const unsubscribes = [];

            collectionData.forEach((reel) => {
                const commentsRef = collection(db, "Reels", reel.id, "comments");
                const q = query(commentsRef);

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const comments = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setReels((prev) => {
                        const others = prev.filter((r) => r.id !== reel.id);
                        return [...others, { ...reel, comments }];
                    });
                });

                unsubscribes.push(unsubscribe);
            });

            if (userId) {
                const currentUserReels = collectionData.filter(reel => reel.uid === userId);
                setUserReels(currentUserReels);
            }

            return () => {
                unsubscribes.forEach((unsub) => unsub());
            };
        }
    }, [userId, collectionData]);

    return {
        reels: reels,
        userReels: userId ? userReels : null,
        loading,
        error,
    };
};