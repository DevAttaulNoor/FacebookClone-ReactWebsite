import { db } from "@services/firebase";
import { arrayUnion, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const handleAddingFriend = async (userId, friendId) => {
    try {
        // Create a friend request entry
        await setDoc(doc(db, "Users", userId, "Friends", friendId), {
            senderUid: userId,
            receiverUid: friendId,
            status: 'pending',
        });

        await updateDoc(doc(db, "Users", userId), {
            notifications: arrayUnion({
                friendId: friendId,
                status: 'pending',
                timestamp: Math.floor(Date.now() / 1000),
            }),
        });

        // Add a request entry for the friend
        await setDoc(doc(db, "Users", friendId, "Friends", userId), {
            senderUid: userId,
            receiverUid: friendId,
            status: 'pending',
        });

        await updateDoc(doc(db, "Users", friendId), {
            notifications: arrayUnion({
                friendId: userId,
                status: 'pending',
                timestamp: Math.floor(Date.now() / 1000),
            }),
        });
    } catch (error) {
        console.error("Error sending friend request:", error);
    }
};

const handleAcceptingFriend = async (userId, friendId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const friendRef = doc(db, "Users", friendId);

        // Update the status of the friend request for both users
        await updateDoc(doc(db, "Users", userId, "Friends", friendId), {
            status: 'accepted',
        });

        await updateDoc(doc(db, "Users", friendId, "Friends", userId), {
            status: 'accepted',
        });

        // Fetch current user's notifications
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const updatedUserNotifications = userData.notifications?.filter(
                (notification) => notification.friendId !== friendId
            );

            updatedUserNotifications.push({
                friendId: friendId,
                status: 'accepted',
                timestamp: Math.floor(Date.now() / 1000),
            });

            await updateDoc(userRef, {
                notifications: updatedUserNotifications,
            });
        }

        // Fetch friend's notifications
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
            const friendData = friendSnap.data();
            const updatedFriendNotifications = friendData.notifications?.filter(
                (notification) => notification.friendId !== userId
            );

            updatedFriendNotifications.push({
                friendId: userId,
                status: 'accepted',
                timestamp: Math.floor(Date.now() / 1000),
            });

            await updateDoc(friendRef, {
                notifications: updatedFriendNotifications,
            });
        }
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
};

const handleDecliningFriend = async (userId, friendId) => {
    try {
        // Remove the friend request from both users' "Friends" collections
        await deleteDoc(doc(db, "Users", userId, "Friends", friendId));
        await deleteDoc(doc(db, "Users", friendId, "Friends", userId));

        // Get user and friend documents
        const userRef = doc(db, "Users", userId);
        const friendRef = doc(db, "Users", friendId);

        const userSnap = await getDoc(userRef);
        const friendSnap = await getDoc(friendRef);

        // Process the notifications for the current user
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const updatedUserNotifications = userData.notifications?.filter(
                (notification) => notification.friendId !== friendId
            );

            if (updatedUserNotifications.length !== userData.notifications.length) {
                await updateDoc(userRef, {
                    notifications: updatedUserNotifications
                });
            }
        }

        // Process the notifications for the friend
        if (friendSnap.exists()) {
            const friendData = friendSnap.data();
            const updatedFriendNotifications = friendData.notifications?.filter(
                (notification) => notification.friendId !== userId
            );

            if (updatedFriendNotifications.length !== friendData.notifications.length) {
                await updateDoc(friendRef, {
                    notifications: updatedFriendNotifications
                });
            }
        }
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
};

export { handleAddingFriend, handleAcceptingFriend, handleDecliningFriend }