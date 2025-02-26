import { useState, useEffect } from 'react';
import { db } from "@services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const usersQuery = collection(db, 'Users');

        const unsubscribeUsers = onSnapshot(
            usersQuery,
            (snapshot) => {
                const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(allUsers);
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

    return { users, loading, error };
};