import { db, storage } from "@services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

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

const handleDeleting = async (postId) => {
    try {
        await deleteDoc(doc(db, 'Posts', postId));
    } catch (error) {
        console.error("Error deleting:", error);
    }
};

const handleReacting = async (postData, userId) => {
    try {
        const postDocRef = doc(db, "Posts", postData?.id);
        const postDoc = await getDoc(postDocRef);

        const userDocRef = doc(db, "Users", postData?.uid);
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
            console.error("Post not found.");
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
                    postId: postData?.id,
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

const handleCommenting = async (postData, userId, commentInput) => {
    try {
        await addDoc(collection(doc(db, "Posts", postData?.id), "comments"), {
            uid: userId,
            comment: commentInput,
            timestamp: Math.floor(new Date().getTime() / 1000),
        });

        const userDocRef = doc(db, "Users", postData?.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            let existingNotifications = userDoc.data().notifications || [];

            existingNotifications.push({
                uid: userId,
                postId: postData?.id,
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

const handlePosting = async (messageData, postData, userData, groupData, usedInGroupPosting, isAnonymous, setloading, handleModalClose, isEdit = false) => {
    const postDetails = {
        uid: userData?.uid,
        email: userData?.email,
        timestamp: Math.floor(new Date().getTime() / 1000),
        ...(usedInGroupPosting ? { groupId: groupData?.id, isAnonymous } : {})
    };

    try {
        setloading(true);

        const postRef = isEdit
            ? doc(db, "Posts", postData?.id)
            : doc(collection(db, "Posts"));

        if ((messageData.text !== '') && (messageData.media === '')) {
            if (isEdit) {
                const updatedData = {
                    message: messageData.text,
                    media: '',
                    mediaType: '',
                };
                if (usedInGroupPosting) {
                    updatedData.isAnonymous = isAnonymous;
                }

                await updateDoc(postRef, updatedData);
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageData.text,
                });
            }

            setloading(false);
            handleModalClose();
        }

        if ((messageData.text === '') && (messageData.media !== '')) {
            let mediaUrl = messageData.media;
            let mediaType = messageData.mediaType;

            if (messageData.media instanceof File) {
                const file = messageData.media;
                const storageRef = ref(storage, `Posts/${userData?.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                mediaUrl = await getDownloadURL(storageRef);
            }

            if (isEdit) {
                const updatedData = {
                    message: '',
                    media: mediaUrl,
                    mediaType: mediaType,
                };
                if (usedInGroupPosting) {
                    updatedData.isAnonymous = isAnonymous;
                }

                await updateDoc(postRef, updatedData);
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    media: mediaUrl,
                    mediaType: mediaType,
                });
            }

            setloading(false);
            handleModalClose();
        }


        if ((messageData.text !== '') && (messageData.media !== '')) {
            let mediaUrl = messageData.media;
            let mediaType = messageData.mediaType;

            if (messageData.media instanceof File) {
                const file = messageData.media;
                const storageRef = ref(storage, `Posts/${userData?.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                mediaUrl = await getDownloadURL(storageRef);
            }

            if (isEdit) {
                const updatedData = {
                    message: messageData.text,
                    media: mediaUrl,
                    mediaType: mediaType,
                };
                if (usedInGroupPosting) {
                    updatedData.isAnonymous = isAnonymous;
                }

                await updateDoc(postRef, updatedData);
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageData.text,
                    media: mediaUrl,
                    mediaType: mediaType,
                });
            }

            setloading(false);
            handleModalClose();
        }

    } catch (error) {
        setloading(false);
        console.error(`Error ${isEdit ? 'editing' : 'uploading'} post: `, error);
    }
};

export { handleSaving, handleDeleting, handleReacting, handleCommenting, handlePosting }