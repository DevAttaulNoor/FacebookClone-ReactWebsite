import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useUsers = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Users');
    const [userCurrent, setUserCurrent] = useState([]);
    const [usersExceptCurrent, setUsersExceptCurrent] = useState([]);

    useEffect(() => {
        if (userId && collectionData) {
            const exceptCurrentUser = collectionData?.filter(user => user.uid !== userId);
            setUsersExceptCurrent(exceptCurrentUser);

            const currentUser = collectionData?.find(user => user.uid === userId);
            setUserCurrent(currentUser);
        }
    }, [userId, collectionData]);

    return {
        users: collectionData ? collectionData : null,
        userCurrent: userId ? userCurrent : null,
        usersExceptCurrent: userId ? usersExceptCurrent : null,
        loading,
        error
    };
};