import { Link, NavLink, useLocation, useParams } from "react-router";
import { useGroups } from "@hooks/useGroups"
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import Group_About from "./Group_About";
import Group_Media from "./Group_Media";
import Group_People from "./Group_People";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";

const Group = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const { groups } = useGroups();
    const { groupPosts } = usePosts();
    const activeGroup = groups?.find(data => data.id === id);
    const groupsJoined = groups?.filter(data => data.adminId === user?.uid || data.members?.some(mem => mem === user?.uid));

    const groupComponents = [
        { id: 1, title: 'About', path: `/group/${id}/about` },
        { id: 2, title: 'Discussion', path: `/group/${id}` },
        { id: 3, title: 'People', path: `/group/${id}/people` },
        { id: 4, title: 'Media', path: `/group/${id}/media` },
    ];

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    <div
                        style={{ backgroundImage: `url(${activeGroup?.coverPhoto})` }}
                        className="w-full h-full flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default"
                    >
                        {activeGroup?.adminId === user?.uid && (
                            <button
                                onClick={() => coverPhotoRef.current.click()}
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-white hover:bg-customGray-default z-[5]"
                            >
                                <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>
                                <p className="text-sm font-semibold">Edit</p>

                                {/* <input
                                    type="file"
                                    ref={coverPhotoRef}
                                    accept="image/*"
                                    onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                                    className="hidden"
                                /> */}
                            </button>
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
                            <button
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                            >
                                <span className="text-lg">{ReactIcons.GROUP}</span>
                                <p className="text-sm font-semibold">Joined</p>
                            </button>
                        ) : (
                            <button
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                            >
                                <span className="text-lg">{ReactIcons.GROUP}</span>
                                <p className="text-sm font-semibold">Leave</p>
                            </button>
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
                                postData={groupPosts}
                                usedInGroupPosting={true}
                            />
                        </div>

                        <div className="flex flex-[0.4] flex-col gap-4">
                            {/* {activeProfileUser?.uid == user?.uid ? (
                                <ProfileComponentLayout
                                    path={`/profile/${activeProfileUser?.uid}/about`}
                                    title={Routes.PROFILE_ABOUT.title}
                                    noSeeAll={false}
                                >
                                    {bioInput.isVisible ? (
                                        <div className="flex flex-col rounded-lg">
                                            <TextareaField
                                                textareaData={{
                                                    rows: 3,
                                                    value: bioInput.value,
                                                    maxLength: bioInput.count,
                                                    placeholder: 'Describe who you are',
                                                    onChange: (e) => setBioInput(prev => ({ ...prev, value: e.target.value })),
                                                }}
                                                textareaStyle="text-center text-sm font-medium py-2 px-3 rounded-lg border-2 resize-none cursor-pointer bg-customGray-default hover:bg-customGray-100"
                                            />

                                            <p className="text-end text-xs font-medium text-customGray-300">
                                                {bioInput.count - bioInput.value.length} characters limit
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-center">{activeProfileUser?.bio}</p>
                                            <button
                                                onClick={() => setBioInput(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                                                className="w-full text-sm font-medium py-2.5 rounded-lg bg-customGray-100 hover:bg-customGray-default"
                                            >
                                                {`${activeProfileUser.bio ? 'Edit' : 'Add'} bio`}
                                            </button>
                                        </>
                                    )}

                                    <div className={`${bioInput.isVisible ? 'flex' : 'hidden'} justify-end gap-2`}>
                                        <button
                                            onClick={handleBioText}
                                            className="text-sm font-medium py-2 px-4 rounded-lg text-white bg-customBlue-default"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => setBioInput(prev => ({ ...prev, isVisible: false }))}
                                            className="text-sm font-medium py-2 px-4 rounded-lg bg-customGray-100"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </ProfileComponentLayout>
                            ) : (
                                <>
                                    {activeProfileUser?.bio && (
                                        <ProfileComponentLayout
                                            path={`/profile/${activeProfileUser?.uid}/about`}
                                            title={Routes.PROFILE_ABOUT.title}
                                            noSeeAll={false}
                                        >
                                            <p className="text-sm text-center">{activeProfileUser?.bio}</p>
                                        </ProfileComponentLayout>
                                    )}
                                </>
                            )}

                            <ProfileComponentLayout
                                path={`/profile/${activeProfileUser?.uid}/photo`}
                                title={Routes.PROFILE_PHOTO.title}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <img
                                        src={activeProfileUser?.profilePhoto}
                                        alt={`profile image of ${activeProfileUser?.username}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {userPostPhotos.length > 0 && (
                                        <>
                                            {userPostPhotos.map((data) => (
                                                <img
                                                    key={data.id}
                                                    src={data.media}
                                                    alt={`image from post of ${data.username}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </ProfileComponentLayout>

                            {userPostVideos.length > 0 && (
                                <ProfileComponentLayout
                                    path={`/profile/${activeProfileUser?.uid}/video`}
                                    title={Routes.PROFILE_VIDEO.title}
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {userPostVideos.map((data) => (
                                            <video
                                                controls
                                                key={data.id}
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={data.media} type="video/mp4" />
                                            </video>
                                        ))}
                                    </div>
                                </ProfileComponentLayout>
                            )}

                            {acceptedFriends.length > 0 && (
                                <ProfileComponentLayout
                                    path={`/profile/${activeProfileUser?.uid}/friend`}
                                    title={Routes.PROFILE_FRIEND.title}
                                >
                                    <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                                        {acceptedFriends?.map((data) => (
                                            <Link
                                                key={data.uid}
                                                to={`/profile/${data.uid}`}
                                                className="flex flex-col gap-1"
                                            >
                                                <ProfileAvatar
                                                    userData={data}
                                                    imageStyleClass="w-full h-full !rounded-lg"
                                                    iconStyleClass="text-3xl"
                                                />

                                                <p className="text-xs font-medium">{data.username}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </ProfileComponentLayout>
                            )} */}
                        </div>
                    </>
                )}

                {location.pathname === `/group/${id}/about` && (
                    <Group_About />
                )}

                {location.pathname === `/group/${id}/people` && (
                    <Group_People />
                )}

                {location.pathname === `/group/${id}/media` && (
                    <Group_Media />
                )}
            </div>
        </div>
    )
}

export default Group