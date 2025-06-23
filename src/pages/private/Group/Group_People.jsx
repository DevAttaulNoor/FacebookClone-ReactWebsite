import { Link } from "react-router";
import { ProfileAvatar } from "@components/universal/ProfileAvatar"
import { GroupComponentLayout } from "@layouts/GroupComponentLayout"

const Group_People = ({ pathData, usersData, groupData }) => {
    const adminData = usersData?.find(data => data.uid === groupData?.adminId);
    const memberData = usersData?.filter(data => groupData?.members?.filter(uid => uid !== groupData?.adminId).includes(data.uid));

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <GroupComponentLayout
                titleData={{
                    path: pathData,
                    text: `Members · ${groupData?.members?.length}`
                }}
                description={"New people and Pages who join this group will appear here."}
                containerStyle={'max-w-[460px] w-full'}
            >
                <div className="flex flex-col gap-3">
                    <h6 className="text-[14px] font-medium">{`Admins · 1`}</h6>

                    <div className="flex items-center gap-2.5">
                        <ProfileAvatar
                            userData={adminData}
                            iconStyleClass={'text-3xl'}
                            imageStyleClass={'w-10 h-10'}
                        />

                        <Link
                            to={`/profile/${adminData?.uid}`}
                            className="text-sm font-medium cursor-pointer hover:underline"
                        >
                            {adminData?.username}
                        </Link>
                    </div>
                </div>

                <hr className="text-customGray-100" />

                <div className="flex flex-col gap-3">
                    <h6 className="text-[14px] font-medium">{`Members · ${memberData?.length}`}</h6>

                    {memberData?.map(data => (
                        <div key={data.uid} className="flex items-center gap-2.5">
                            <ProfileAvatar
                                key={data.uid}
                                userData={data}
                                iconStyleClass={'text-3xl'}
                                imageStyleClass={'w-10 h-10'}
                            />

                            <Link
                                to={`/profile/${data.uid}`}
                                className="text-sm font-medium cursor-pointer hover:underline"
                            >
                                {data.username}
                            </Link>
                        </div>
                    ))}
                </div>
            </GroupComponentLayout>
        </div>
    )
}

export default Group_People