import { db, storage } from "@services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

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

export { handlePosting }