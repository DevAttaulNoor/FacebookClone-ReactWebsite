import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@services/firebase";

export const useGroups = (userId) => {
    const [groups, setGroups] = useState([]);
    const [userGroupsJoined, setUserGroupsJoined] = useState([]);
    const [userGroupsCreated, setUserGroupsCreated] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeGroups = onSnapshot(collection(db, 'Groups'),
            (snapshot) => {
                const allGroups = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setGroups(allGroups);

                // Filter groups current user joined (excluding those they created)
                const joinedGroups = allGroups.filter(group =>
                    group.adminId !== userId &&
                    group.members?.includes(userId)
                );
                setUserGroupsJoined(joinedGroups);

                // Filter groups current user created
                const createdGroups = allGroups.filter(group =>
                    group.adminId === userId
                );
                setUserGroupsCreated(createdGroups);

                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeGroups();
        };
    }, [userId]);

    return { groups, userGroupsJoined, userGroupsCreated, loading, error };
};