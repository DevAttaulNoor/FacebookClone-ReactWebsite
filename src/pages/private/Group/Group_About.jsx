import { Link, useParams } from "react-router"
import { ReactIcons } from "@constants/ReactIcons"
import { formatJoinedDate } from "@utils/TimeModule"
import { ProfileAvatar } from "@components/universal/ProfileAvatar"
import { GroupComponentLayout } from "@layouts/GroupComponentLayout"

const Group_About = ({ usersData, groupData }) => {
    const { id } = useParams();
    const adminData = usersData?.find(data => data.uid === groupData?.adminId);
    const memberData = usersData?.filter(data => groupData?.members?.includes(data.uid));

    const aboutSectionItems = [
        {
            id: 1,
            icon: ReactIcons.GLOBE,
            title: 'Public',
            description: "Anyone can see who's in the group and what they post.",
        },
        {
            id: 2,
            icon: ReactIcons.EYE,
            title: 'Visible',
            description: "Anyone can find this group.",
        },
        {
            id: 3,
            icon: ReactIcons.CLOCK,
            title: 'History',
            description: `Group created on ${formatJoinedDate(groupData?.timestamp)}`,
        },
    ]

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <GroupComponentLayout
                title={'About this group'}
                description={groupData?.description}
                containerStyle={'w-[460px]'}
            >
                {aboutSectionItems.map(data => (
                    <div key={data.id} className="flex items-center gap-2.5">
                        <span className="text-2xl text-customGray-200">{data.icon}</span>

                        <div className="flex flex-col">
                            <h5 className="font-semibold">{data.title}</h5>
                            <p className="text-xs">{data.description}</p>
                        </div>
                    </div>
                ))}
            </GroupComponentLayout>

            <GroupComponentLayout
                title={`Members · ${groupData?.members?.length}`}
                containerStyle={'w-[460px]'}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        {memberData?.slice(0, 9).map(data => (
                            <ProfileAvatar
                                key={data.uid}
                                userData={data}
                                iconStyleClass={'text-3xl'}
                                imageStyleClass={'w-10 h-10'}
                            />
                        ))}
                    </div>

                    <p className="text-sm">There are {groupData?.members?.length} members</p>
                </div>

                <div className="flex flex-col gap-2">
                    <ProfileAvatar
                        userData={adminData}
                        iconStyleClass={'text-3xl'}
                        imageStyleClass={'w-10 h-10'}
                    />

                    <p className="text-sm">{adminData?.username} is the admin of the groups</p>
                </div>

                <Link
                    to={`/group/${id}/people`}
                    className="w-full text-center text-sm font-medium py-2.5 rounded-lg bg-customGray-100 hover:bg-customGray-default"
                >
                    See all
                </Link>
            </GroupComponentLayout>
        </div>
    )
}

export default Group_About