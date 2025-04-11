import { GroupCard } from "@components/group-related/GroupCard"

const Group_Joined = ({ userData, groupsData }) => {
    const groupsJoined = groupsData?.filter(
        data =>
            data.adminId === userData?.uid ||
            data.members?.some(mem => mem === userData?.uid)
    );

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">All the groups you have joined ({groupsJoined?.length})</h1>

            <div className="grid grid-cols-5 gap-3">
                {groupsJoined.map((data) => (
                    <GroupCard
                        key={data.id}
                        userData={userData}
                        groupData={data}
                    />
                ))}
            </div>
        </div>
    )
}

export default Group_Joined