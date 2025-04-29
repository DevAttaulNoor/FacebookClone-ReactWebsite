import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@services/firebase';

export const useCollectionData = (collectionName) => {
    const [collectionData, setCollectionData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
            const allData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCollectionData(allData);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    return { collectionData, loading, error };
};