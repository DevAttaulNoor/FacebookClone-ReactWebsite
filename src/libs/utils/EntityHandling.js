import { db, storage } from "@services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

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

export { handleSaving, handleDeleting, handlePosting }