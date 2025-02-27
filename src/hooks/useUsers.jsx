import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useUsers = (userId) => {
    const [users, setUsers] = useState([]);
    const [usersExceptCurrent, setUsersExceptCurrent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const usersQuery = collection(db, 'Users');

        const unsubscribeUsers = onSnapshot(
            usersQuery,
            (snapshot) => {
                const allUsers = snapshot.docs.map(doc => ({ ...doc.data() }));
                setUsers(allUsers);

                // Filter user form the current user
                if (userId) {
                    const currentUser = allUsers.filter(user => user.uid !== userId);
                    setUsersExceptCurrent(currentUser);
                }

                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeUsers();
        };
    }, []);

    return { usersExceptCurrent, users, loading, error };
};