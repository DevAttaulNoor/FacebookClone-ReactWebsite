import { db, storage } from "@services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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

const handleGroupCreation = async (userData, groupData, setGroupData, group_coverphoto, setLoading) => {
    try {
        setLoading(true);
        const allMembers = [...groupData.members, userData?.uid];

        let coverPhotoUrl = "";
        if (groupData.coverPhoto) {
            const file = groupData.coverPhoto;
            const storageRef = ref(storage, `Groups/${userData?.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            coverPhotoUrl = await getDownloadURL(storageRef);
        } else {
            const response = await fetch(group_coverphoto);
            const blob = await response.blob();
            const storageRef = ref(storage, `Groups/${userData?.uid}/cover_photo.jpg`);
            await uploadBytes(storageRef, blob);
            coverPhotoUrl = await getDownloadURL(storageRef);
        }

        await setDoc(doc(collection(db, "Groups")), {
            adminId: userData?.uid,
            adminEmail: userData?.email,
            name: groupData.name,
            members: allMembers,
            coverPhoto: coverPhotoUrl,
            timestamp: Math.floor(new Date().getTime() / 1000),
        });

        setLoading(false);
        setGroupData({
            name: '',
            members: [],
            coverPhoto: '',
        })
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
};

export { handleGroupJoining, handleGroupCreation }