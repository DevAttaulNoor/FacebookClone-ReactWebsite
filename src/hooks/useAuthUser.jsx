import { useState, useEffect } from "react";
import { auth, db } from "@services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAuthUser = () => {
    const [user, setUser] = useState('');
    const [error, setError] = useState(null);
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
                } else {
                    setUser('');
                }
            } catch (err) {
                setError(err);
                setUser('');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { isAuthenticated: !!user, user, loading, error };
};