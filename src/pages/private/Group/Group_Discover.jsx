import { GroupCard } from "@components/group-related/GroupCard"

const Group_Discover = ({ userData, groupsData }) => {
    const groupsToExplore = groupsData?.filter(
        data =>
            data.adminId !== userData?.uid &&
            !data.members?.includes(userData?.uid)
    );

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-xl font-bold">Suggested for you</h1>
                <h5>Groups you might be interested in.</h5>
            </div>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {groupsToExplore.map((data) => (
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

export default Group_Discover