import { useState, useEffect } from "react";
import { auth, db } from "@services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAuthUser = () => {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userData = await getDoc(doc(db, "Users", currentUser.uid));
                setUser({
                    ...userData.data(),
                    metadata: currentUser.metadata,
                })
            }

            else {
                setUser('')
            }
        });

        return () => unsubscribe();
    }, []);

    return user;
};
