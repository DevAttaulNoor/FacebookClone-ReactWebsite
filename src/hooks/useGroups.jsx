import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useGroups = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Groups');
    const [userGroupsJoined, setUserGroupsJoined] = useState([]);
    const [userGroupsCreated, setUserGroupsCreated] = useState([]);
    const [userRelatedGroups, setUserRelatedGroups] = useState([]);

    useEffect(() => {
        if (userId && collectionData) {
            const createdGroups = collectionData?.filter(group => group.adminId === userId);
            setUserGroupsCreated(createdGroups);

            const joinedGroups = collectionData?.filter(group => group.adminId !== userId && group.members?.includes(userId));
            setUserGroupsJoined(joinedGroups);

            setUserRelatedGroups(createdGroups.concat(joinedGroups));
        }
    }, [userId, collectionData]);

    return {
        groups: collectionData ? collectionData : null,
        userGroupsJoined: userId ? userGroupsJoined : null,
        userGroupsCreated: userId ? userGroupsCreated : null,
        userRelatedGroups: userId ? userRelatedGroups : null,
        loading,
        error
    };
};