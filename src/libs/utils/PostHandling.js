import { db, storage } from "@services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

const handleDeleting = async (postId) => {
    try {
        await deleteDoc(doc(db, 'Posts', postId));
    } catch (error) {
        console.error("Error deleting:", error);
    }
};

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

const handlePosting = async (messageData, postData, userData, groupData, usedInGroupPosting, isAnonymous, setloading, handleModalClose, isEdit = false) => {
    const postDetails = {
        uid: userData?.uid,
        email: userData?.email,
        timestamp: Math.floor(new Date().getTime() / 1000),
        ...(usedInGroupPosting ? { groupId: groupData?.id, isAnonymous } : {})
    };

    try {
        setloading(true);

        // Determine if we're creating or updating a post
        const postRef = isEdit
            ? doc(db, "Posts", postData?.id)
            : doc(collection(db, "Posts"));

        if ((messageData.text !== '') && (messageData.media === '')) {
            if (isEdit) {
                await updateDoc(postRef, {
                    message: messageData.text,
                    media: '',
                    mediaType: '',
                });
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageData.text,
                });
            }

            setloading(false)
            handleModalClose();
        }

        if ((messageData.text === '') && (messageData.media !== '')) {
            const file = messageData.media;
            const storageRef = ref(storage, `Posts/${userData?.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            let mediaUrl = await getDownloadURL(storageRef);

            if (isEdit) {
                await updateDoc(postRef, {
                    message: '',
                    media: mediaUrl,
                    mediaType: messageData.mediaType,
                });
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    media: mediaUrl,
                    mediaType: messageData.mediaType,
                });
            }

            setloading(false)
            handleModalClose();
        }

        if ((messageData.text !== '') && (messageData.media !== '')) {
            const file = messageData.media;
            const storageRef = ref(storage, `Posts/${userData?.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            let mediaUrl = await getDownloadURL(storageRef);

            if (isEdit) {
                await updateDoc(postRef, {
                    message: messageData.text,
                    media: mediaUrl,
                    mediaType: messageData.mediaType,
                });
            } else {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageData.text,
                    media: mediaUrl,
                    mediaType: messageData.mediaType,
                });
            }

            setloading(false)
            handleModalClose();
        }
    } catch (error) {
        setloading(false);
        console.error(`Error ${isEdit ? 'editing' : 'uploading'} post: `, error);
    }
};

export { handleDeleting, handleSaving, handlePosting }