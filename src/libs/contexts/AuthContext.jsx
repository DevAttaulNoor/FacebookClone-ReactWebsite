import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@services/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUser = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userRef = doc(db, "Users", currentUser.uid);
                    unsubscribeUser = onSnapshot(userRef, (docSnap) => {
                        if (docSnap.exists()) {
                            setUser({
                                ...docSnap.data(),
                                metadata: currentUser.metadata,
                            });
                        } else {
                            setUser(null);
                        }
                        setLoading(false);
                    });
                } else {
                    setUser(null);
                    setLoading(false);
                    if (unsubscribeUser) unsubscribeUser();
                }
            } catch (err) {
                setError(err);
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUser) unsubscribeUser();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};