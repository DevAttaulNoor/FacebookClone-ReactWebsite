import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const usePosts = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Posts');
    const [userPosts, setUserPosts] = useState([]);
    const [groupPosts, setGroupPosts] = useState([]);

    useEffect(() => {
        if (collectionData) {
            setGroupPosts(collectionData?.filter(post => post.groupId && post.groupId !== ''));

            if (userId) {
                setUserPosts(collectionData?.filter(post => (!post.groupId || post.groupId === '') && post.uid === userId));
            }
        }
    }, [userId, collectionData]);

    return {
        posts: collectionData ? collectionData : null,
        userPosts: userId ? userPosts : null,
        groupPosts: collectionData ? groupPosts : null,
        postsLoading: loading,
        postsError: error
    };
};