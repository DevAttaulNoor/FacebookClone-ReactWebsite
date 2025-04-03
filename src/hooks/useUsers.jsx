import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '@services/firebase';

export const useUsers = (userId) => {
    const [users, setUsers] = useState([]);
    const [usersExceptCurrent, setUsersExceptCurrent] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersQuery = collection(db, 'Users');

        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(allUsers);

            // Filter out the current user
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
    }, [userId]);

    return { usersExceptCurrent, users, loading, error };
};