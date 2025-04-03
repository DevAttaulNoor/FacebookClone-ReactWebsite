import { useState, useEffect } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "@services/firebase";

export const usePosts = (userId) => {
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postsQuery = collection(db, "Posts");

        const unsubscribePosts = onSnapshot(
            postsQuery,
            (snapshot) => {
                let allPosts = snapshot.docs.map(postDoc => ({
                    id: postDoc.id,
                    ...postDoc.data(),
                    comments: []
                }));

                // Create a map to store unsubscribe functions for each post's comments
                const unsubscribeCommentsMap = {};

                allPosts.forEach(post => {
                    const commentsRef = collection(doc(db, "Posts", post.id), "comments");

                    const unsubscribeComments = onSnapshot(
                        commentsRef,
                        (commentsSnapshot) => {
                            const postComments = commentsSnapshot.docs.map(commentDoc => ({
                                id: commentDoc.id,
                                ...commentDoc.data(),
                            }));

                            // Update the post with its real-time comments
                            setPosts(prevPosts =>
                                prevPosts.map(p => p.id === post.id ? { ...p, comments: postComments } : p)
                            );
                        },
                        (err) => console.error(`Error fetching comments for post ${post.id}:`, err)
                    );

                    // Store the unsubscribe function for cleanup
                    unsubscribeCommentsMap[post.id] = unsubscribeComments;
                });

                setPosts(allPosts);

                if (userId) {
                    setUserPosts(allPosts.filter(post => post.uid === userId));
                }

                setLoading(false);

                return () => {
                    Object.values(unsubscribeCommentsMap).forEach(unsub => unsub());
                };
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
