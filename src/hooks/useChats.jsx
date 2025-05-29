import { useState, useEffect, useMemo } from "react";
import { useCollectionData } from "./useDataCollection";

export const useChats = (userId, friendIds) => {
    const { collectionData, loading, error } = useCollectionData('Chats');
    const [userChats, setUserChats] = useState([]);
    const memoizedFriendIds = useMemo(() => friendIds, [JSON.stringify(friendIds)]);
    const getChatId = (uid1, uid2) => uid1 < uid2 ? `${uid1}${uid2}` : `${uid2}${uid1}`;

    useEffect(() => {
        if (userId && Array.isArray(memoizedFriendIds) && collectionData) {
            const chatIdsToCheck = memoizedFriendIds.map(fid => getChatId(userId, fid));
            const relatedChats = collectionData.filter(chat =>
                chatIdsToCheck.includes(chat.uids)
            );
            setUserChats(relatedChats);
        }
    }, [userId, memoizedFriendIds, collectionData]);

    return {
        chats: collectionData || null,
        userChats: (userId && memoizedFriendIds) ? userChats : null,
        chatsLoading: loading,
        chatsError: error
    };
};