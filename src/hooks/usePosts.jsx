import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const usePosts = (userId) => {
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const postsQuery = collection(db, 'Posts');

        const unsubscribePosts = onSnapshot(
            postsQuery,
            (snapshot) => {
                const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPosts(allPosts);

                // Filter posts for the current user
                if (userId) {
                    const currentUserPosts = allPosts.filter(post => post.uid === userId);
                    setUserPosts(currentUserPosts);
                }

                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribePosts();
        };
    }, [userId]);

    return { posts, userPosts, loading, error };
};