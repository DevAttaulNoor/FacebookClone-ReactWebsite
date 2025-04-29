import { useEffect, useState } from "react";
import { useCollectionData } from "./useDataCollection";

export const useUsers = (userId) => {
    const { collectionData, loading, error } = useCollectionData('Users');
    const [usersExceptCurrent, setUsersExceptCurrent] = useState([]);

    useEffect(() => {
        if (userId && collectionData) {
            const exceptCurrentUser = collectionData?.filter(user => user.uid !== userId);
            setUsersExceptCurrent(exceptCurrentUser);
        }
    }, [userId, collectionData]);

    return {
        users: collectionData ? collectionData : null,
        usersExceptCurrent: userId ? usersExceptCurrent : null,
        loading,
        error
    };
};