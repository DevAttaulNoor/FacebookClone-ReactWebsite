import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@services/firebase";

export const useChats = () => {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeChats = onSnapshot(collection(db, 'Chats'), (snapshot) => {
            const allChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChats(allChats);
            setLoading(false);
        },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeChats();
        };
    }, []);

    return { chats, loading, error };
};