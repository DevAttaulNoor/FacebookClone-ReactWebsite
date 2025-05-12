import { db } from "@services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const handleSaving = async (postId, userId) => {
    try {
        const postDocRef = doc(db, "Posts", postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
            const existingSaves = postDoc.data().saves || [];
            const userIndex = existingSaves.findIndex(entry => entry.uid === userId);

            if (userIndex !== -1) {
                const updatedSaves = existingSaves.filter(entry => entry.uid !== userId);
                await updateDoc(postDocRef, { saves: updatedSaves });
            } else {
                const updatedSaves = [...existingSaves, { uid: userId, timestamp: Math.floor(Date.now() / 1000) }];
                await updateDoc(postDocRef, { saves: updatedSaves });
            }
        } else {
            console.error("Post not found.");
        }
    } catch (error) {
        console.error("Error saving post:", error);
    }
};

export { handleSaving }