import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@services/firebase";
import { GroupCard } from "@components/group-related/GroupCard"

const Group_Discover = ({ userData, groupsData }) => {
    const [loading, setLoading] = useState(false);
    const groupsToExplore = groupsData?.filter(
        data =>
            data.adminId !== userData?.uid &&
            !data.members?.includes(userData?.uid)
    );

    const handleGroupJoining = async (userId, groupId) => {
        try {
            setLoading(true);
            const groupDoc = await getDoc(doc(db, "Groups", groupId));

            if (groupDoc.exists()) {
                let existingMembers = groupDoc.data().members || [];
                await updateDoc(doc(db, "Groups", groupId), {
                    members: [...existingMembers, userId],
                });
            } else {
                console.error("Group not found.");
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-xl font-bold">Suggested for you</h1>
                <h5>Groups you might be interested in.</h5>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {groupsToExplore.map((data) => (
                    <GroupCard
                        key={data.id}
                        userData={userData}
                        groupData={data}
                        joiningLoading={loading}
                        handleGroupJoining={handleGroupJoining}
                    />
                ))}
            </div>
        </div>
    )
}

export default Group_Discover