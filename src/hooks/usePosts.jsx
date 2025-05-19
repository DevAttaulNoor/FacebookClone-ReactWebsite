import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@services/firebase";
import { useCollectionData } from "./useDataCollection";

export const usePosts = (userId) => {
    const { collectionData, loading, error } = useCollectionData("Posts");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (collectionData) {
            const unsubscribes = [];

            collectionData.forEach((post) => {
                const commentsRef = collection(db, "Posts", post.id, "comments");
                const q = query(commentsRef);

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const comments = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setPosts((prev) => {
                        const others = prev.filter((r) => r.id !== post.id);
                        return [...others, { ...post, comments }];
                    });
                });

                unsubscribes.push(unsubscribe);
            });

            return () => {
                unsubscribes.forEach((unsub) => unsub());
            };
        }
    }, [collectionData]);

    // Use useMemo to efficiently derive filtered posts
    const { userPosts, groupPosts } = useMemo(() => {
        const userPosts = posts?.filter(post => (!post.groupId || post.groupId === '') && (post.uid === userId));
        const groupPosts = posts?.filter(post => post.groupId && post.groupId !== '');
        return { userPosts, groupPosts };
    }, [posts, userId]);

    return {
        posts: posts,
        userPosts,
        groupPosts,
        loading,
        error,
    };
};