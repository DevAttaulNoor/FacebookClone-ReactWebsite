import { db } from "@services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const handleGroupJoining = async (userId, groupId, setLoading) => {
    try {
        setLoading(true);
        const groupDoc = await getDoc(doc(db, "Groups", groupId));

        if (groupDoc.exists()) {
            let existingMembers = groupDoc.data().members || [];

            if (existingMembers.includes(userId)) {
                existingMembers = existingMembers.filter(member => member !== userId);
            } else {
                existingMembers.push(userId);
            }

            await updateDoc(doc(db, "Groups", groupId), {
                members: existingMembers
            });
        } else {
            console.error("Group not found.");
        }
    } catch (error) {
        console.error("Error handling group joining:", error);
    } finally {
        setLoading(false);
    }
};

export { handleGroupJoining }