import { useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, NavLink, useLocation, useParams } from "react-router";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";
import { useGroups } from "@hooks/useGroups";
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@services/firebase";
import { ReactIcons } from "@constants/ReactIcons";
import { formatJoinedDate } from "@utils/TimeModule";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { GroupComponentLayout } from "@layouts/GroupComponentLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";
import Group_About from "./Group_About";
import Group_Media from "./Group_Media";
import Group_People from "./Group_People";

const Group = () => {
    const location = useLocation();
    const coverPhotoRef = useRef();
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const { groups } = useGroups();
    const { groupPosts } = usePosts();
    const activeGroup = groups?.find(data => data.id === id);
    const activeGroupPosts = groupPosts?.filter(data => data.groupId === activeGroup?.id)
    const groupsJoined = groups?.filter(data => data.adminId === user?.uid || data.members?.some(mem => mem === user?.uid));

    const groupComponents = [
        { id: 1, title: 'About', path: `/group/${id}/about` },
        { id: 2, title: 'Discussion', path: `/group/${id}` },
        { id: 3, title: 'People', path: `/group/${id}/people` },
        { id: 4, title: 'Media', path: `/group/${id}/media` },
    ];

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
            description: `Group created on ${formatJoinedDate(activeGroup?.timestamp)}`,
        },
    ];

    const handlePhotoChange = async (photoTypeRef, groupId) => {
        const file = photoTypeRef.current.files[0];
        if (file) {
            try {
                let photo;
                const storageRef = ref(storage, `Groups/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                photo = await getDownloadURL(storageRef);

                const groupDocRef = doc(db, "Groups", groupId);
                await updateDoc(groupDocRef, { coverPhoto: photo });
                console.log(`Success uploading coverPhoto`);
            } catch (error) {
                console.error(`Error uploading coverPhoto:`, error);
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    <div
                        style={{ backgroundImage: `url(${activeGroup?.coverPhoto})` }}
                        className="w-full h-full flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default"
                    >
                        {activeGroup?.adminId === user?.uid && (<>
                            <BasicButton
                                btnStyleClass="!w-fit z-[5] bg-white hover:bg-slate-50"
                                btnData={{
                                    text: activeGroup?.adminId ? 'Edit' : 'Add',
                                    icon: activeGroup?.adminId ? ReactIcons.EDIT_PENCIL : ReactIcons.ADD_PLUS,
                                    onClick: () => coverPhotoRef.current.click(),
                                }}
                            />

                            <input
                                ref={coverPhotoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                            />
                        </>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full flex items-end justify-between p-4">
                    <div className='flex flex-col'>
                        <h3 className="text-[28px] font-bold">{activeGroup?.name}</h3>

                        {/* Members Count */}
                        <div className="w-fit text-sm font-medium text-customGray-300 cursor-pointer hover:underline">
                            {`${activeGroup?.members?.length} ${activeGroup?.members?.length > 1 ? 'members' : 'member'}`}
                        </div>

                        {/* Members List Preview */}
                        <div className="flex items-center">
                            {activeGroup?.members?.slice(0, 8).map((data) => (
                                <Link
                                    key={data}
                                    to={`/profile/${data}`}
                                    className="rounded-full border-2 border-white -ml-2 first:-ml-0"
                                >
                                    <ProfileAvatar
                                        userData={data}
                                        imageStyleClass="w-8 h-8"
                                        iconStyleClass="text-2xl"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {groupsJoined ? (
                            <BasicButton
                                btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                btnData={{
                                    text: 'Joined',
                                    icon: ReactIcons.GROUP,
                                }}
                            />
                        ) : (
                            <BasicButton
                                btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                btnData={{
                                    text: 'Leave',
                                    icon: ReactIcons.GROUP,
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Group Components Navigation */}
                <div className="max-w-[1040px] w-full flex items-center justify-between px-4 border-t border-slate-400">
                    <div className="flex gap-1">
                        {groupComponents.map((data) => (
                            <NavLink
                                end
                                key={data.id}
                                to={data.path}
                                className={({ isActive }) => `${isActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-sm font-semibold p-4 my-1 rounded-lg cursor-pointer`}
                            >
                                {data.title}
                            </NavLink>
                        ))}
                    </div>

                    <span className="text-xl cursor-pointer">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            {/* Group Page Components */}
            <div className="max-w-[1040px] w-full flex p-4 gap-4">
                {location.pathname === `/group/${id}` && (
                    <>
                        <div className="flex flex-[0.6] w-full flex-col gap-4">
                            <FeedPostPosting
                                groupData={activeGroup}
                                usedInGroupPosting={true}
                            />

                            <FeedPost
                                activeUser={user}
                                userData={users}
                                groupData={groups}
                                postData={activeGroupPosts}
                                usedInGroupPosting={true}
                            />
                        </div>

                        <div className="flex flex-[0.4] flex-col gap-4">
                            <GroupComponentLayout
                                title={'About this group'}
                                description={activeGroup?.description}
                                containerStyle={'w-full'}
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
                        </div>
                    </>
                )}

                {location.pathname === `/group/${id}/about` && (
                    <Group_About
                        usersData={users}
                        groupData={activeGroup}
                    />
                )}

                {location.pathname === `/group/${id}/people` && (
                    <Group_People
                        usersData={users}
                        groupData={activeGroup}
                    />
                )}

                {((location.pathname === `/group/${id}/media`) ||
                    (location.pathname === `/group/${id}/media/photos`) ||
                    (location.pathname === `/group/${id}/media/videos`)) && (
                        <Group_Media
                            groupPosts={activeGroupPosts}
                        />
                    )}
            </div>
        </div>
    )
}

export default Group