import { useState, useEffect } from "react";
import { auth, db } from "@services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAuthUser = () => {
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
                    setUser({
                        ...userDoc.data(),
                        metadata: currentUser.metadata,
                    });

                    setLoading(false);
                }
            } catch (err) {
                setUser('');
                setError(err);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading, error };
};