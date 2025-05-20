import { db } from "@services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const handleReacting = async (entity, entityData, userId) => {
    try {
        const postDocRef = doc(db, entity, entityData?.id);
        const postDoc = await getDoc(postDocRef);

        const userDocRef = doc(db, "Users", entityData?.uid);
        const userDoc = await getDoc(userDocRef);

        if (postDoc.exists()) {
            let existingReactions = postDoc.data().reactions || [];

            if (existingReactions.some(reaction => reaction.uid === userId)) {
                // Remove user reaction
                existingReactions = existingReactions.filter(reaction => reaction.uid !== userId);
            } else {
                // Add user reaction with timestamp
                existingReactions.push({
                    uid: userId,
                    timestamp: Math.floor(Date.now() / 1000),
                });
            }

            await updateDoc(postDocRef, { reactions: existingReactions });
        } else {
            console.error(`${entity} not found.`);
            return;
        }

        if (userDoc.exists()) {
            let existingNotifications = userDoc.data().notifications || [];

            if (existingNotifications.some(reaction => reaction.uid === userId)) {
                // Remove user reaction
                existingNotifications = existingNotifications.filter(notification => notification.uid !== userId);
            } else {
                // Add user reaction with timestamp
                existingNotifications.push({
                    uid: userId,
                    postId: entityData?.id,
                    status: 'reacted',
                    timestamp: Math.floor(Date.now() / 1000),
                });
            }

            await updateDoc(userDocRef, { notifications: existingNotifications });
        } else {
            console.error("User not found.");
        }
    } catch (error) {
        console.error("Error updating reaction:", error);
    }
};

const handleCommenting = async (entity, entityData, userId, commentInput) => {
    try {
        const postDocRef = doc(db, entity, entityData?.id);
        const postDoc = await getDoc(postDocRef);

        const userDocRef = doc(db, "Users", entityData?.uid);
        const userDoc = await getDoc(userDocRef);

        if (postDoc.exists()) {
            let existingComments = postDoc.data().comments || [];

            existingComments.push({
                uid: userId,
                comment: commentInput,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            await updateDoc(postDocRef, { comments: existingComments });
        } else {
            console.error(`${entity} not found.`);
            return;
        }

        if (userDoc.exists()) {
            let existingNotifications = userDoc.data().notifications || [];

            existingNotifications.push({
                uid: userId,
                postId: entityData?.id,
                status: 'commented',
                comment: commentInput,
                timestamp: Math.floor(Date.now() / 1000),
            });

            await updateDoc(userDocRef, { notifications: existingNotifications });
        } else {
            console.error("User not found.");
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    }
};

export { handleReacting, handleCommenting }