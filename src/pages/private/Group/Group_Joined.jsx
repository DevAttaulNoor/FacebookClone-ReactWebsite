import { GroupCard } from "@components/group-related/GroupCard"

const Group_Joined = ({ userData, groupsData }) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">All the groups you have joined ({groupsData?.length})</h1>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {groupsData?.map((data) => (
                    <GroupCard
                        key={data.id}
                        groupData={data}
                        userData={userData}
                        userRelatedGroup={groupsData}
                    />
                ))}
            </div>
        </div>
    )
}

export default Group_Joined