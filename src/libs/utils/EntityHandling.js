import { db } from "@services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const handleSaving = async (entity, entityId, userId) => {
    try {
        const entityDocRef = doc(db, entity, entityId);
        const entityDoc = await getDoc(entityDocRef);

        if (entityDoc.exists()) {
            const existingSaves = entityDoc.data().saves || [];
            const userIndex = existingSaves.findIndex(entry => entry.uid === userId);

            if (userIndex !== -1) {
                const updatedSaves = existingSaves.filter(entry => entry.uid !== userId);
                await updateDoc(entityDocRef, { saves: updatedSaves });
            } else {
                const updatedSaves = [...existingSaves, { uid: userId, timestamp: Math.floor(Date.now() / 1000) }];
                await updateDoc(entityDocRef, { saves: updatedSaves });
            }
        } else {
            console.error(`${entity} not found`);
        }
    } catch (error) {
        console.error(`Error saving ${entity}`, error);
    }
};

const handleDeleting = async (entity, entityId) => {
    try {
        await deleteDoc(doc(db, entity, entityId));
    } catch (error) {
        console.error(`Error deleting ${entity}`, error);
    }
};

export { handleSaving, handleDeleting }