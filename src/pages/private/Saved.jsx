import { NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useGroups } from "@hooks/useGroups";
import { SvgIcons } from "@constants/SvgIcons";
import { useAuth } from "@contexts/AuthContext";
import { handleSaving } from "@utils/PostHandling";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { BasicButton } from "@components/universal/buttons/BasicButton";

const Saved = () => {
    const { user } = useAuth();
    const { users } = useUsers();
    const { groups } = useGroups();
    const { posts, groupPosts } = usePosts();
    const savedPosts = posts?.concat(groupPosts)?.filter(post => post?.saves?.some(save => save.uid === user.uid));

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Saved" icon={ReactIcons.SETTING}>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1">
                    <NavLink
                        end
                        to={Routes.SAVED.path}
                        className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between px-3.5 py-2 rounded-3xl cursor-pointer sm:p-2 sm:rounded-lg`}
                    >
                        {({ isActive }) => (
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} hidden text-2xl p-2 rounded-full sm:block`}>
                                    {SvgIcons.SAVED({ styleClass: 'w-[22px] h-[22px]' })}
                                </span>
                                <p className={`${isActive && "text-customBlue-300"} font-medium sm:text-black`}>Saved items</p>
                            </div>
                        )}
                    </NavLink>
                </div>
            </LeftbarLayout>

            <div className='w-full flex-1 flex flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 2xl:px-16'>
                <h1 className="text-xl font-bold">All</h1>

                {savedPosts.length > 0 ? (
                    <>
                        {savedPosts?.map((data) => {
                            const savedPostUser = users.find(user => user.uid === data.uid);
                            const savedPostGroup = groups.find(group => group.id === data.groupId)

                            return (
                                <div key={data.id} className='w-full h-40 flex p-3 gap-4 rounded-md shadow-customFull2 bg-white'>
                                    {data?.media ? (
                                        <img
                                            src={data?.media}
                                            alt={`image of ${savedPostUser?.username} post`}
                                            className="w-36 cursor-pointer object-cover rounded-md"
                                        />
                                    ) : (
                                        <>
                                            {savedPostUser?.profilePhoto ? (
                                                <img
                                                    src={savedPostUser?.profilePhoto}
                                                    alt={`image of ${savedPostUser?.username}`}
                                                    className="w-36 cursor-pointer object-cover rounded-md"
                                                />
                                            ) : (
                                                <span className="flex items-center justify-center text-8xl h-52 w-full rounded-md bg-customGray-default">
                                                    {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                                                </span>
                                            )}
                                        </>
                                    )}

                                    <div className='flex flex-col justify-between'>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg font-bold cursor-pointer hover:underline">{data?.message ? data?.message : '1 Photo'}</h3>

                                            {data?.groupId ? (
                                                <div className='flex items-center gap-1'>
                                                    <>
                                                        {data?.isAnonymous ? (
                                                            <div className="relative mr-1">
                                                                <img
                                                                    src={data?.coverPhoto}
                                                                    alt={`cover picture of ${data?.name}`}
                                                                    className='w-8 h-8 object-contain border rounded-lg border-customGray-100 bg-white'
                                                                />

                                                                <div className="absolute -bottom-2 -right-2">
                                                                    <span className='text-xl'>
                                                                        {ReactIcons.PROFILE_AVATAR}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative mr-1">
                                                                <img
                                                                    src={data?.coverPhoto}
                                                                    alt={`cover picture of ${data?.name}`}
                                                                    className='w-8 h-8 object-contain border rounded-lg border-customGray-100 bg-white'
                                                                />

                                                                <div className="absolute -bottom-2 -right-2">
                                                                    <ProfileAvatar
                                                                        userData={savedPostUser}
                                                                        imageStyleClass='w-5 h-5'
                                                                        iconStyleClass='text-xl'
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>

                                                    <p className="text-xs text-customGray-300">Saved from</p>

                                                    <span className="text-xs font-medium cursor-pointer hover:underline">
                                                        {data?.isAnonymous ? 'Anonymous participant' : savedPostUser?.username}'s post
                                                    </span>

                                                    <p className="text-xs text-customGray-300">in</p>

                                                    <span className="text-xs font-medium cursor-pointer hover:underline">
                                                        {savedPostGroup?.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-1'>
                                                    <ProfileAvatar
                                                        userData={savedPostUser}
                                                        imageStyleClass='w-6 h-6'
                                                        iconStyleClass='text-xl'
                                                    />

                                                    <p className="text-xs text-customGray-300">Saved from</p>
                                                    <span className="text-xs font-medium cursor-pointer hover:underline">{savedPostUser?.username}'s post</span>
                                                </div>
                                            )}
                                        </div>

                                        <BasicButton
                                            btnStyleClass="!w-32 bg-customGray-100 hover:bg-customGray-default"
                                            btnData={{
                                                text: 'Unsave',
                                                onClick: () => handleSaving(data.id, user.uid)
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div className="w-full h-24 flex items-center justify-center text-center text-xl font-semibold p-3 gap-4 rounded-md shadow-customFull2 text-customGray-300 bg-white">
                        You do not have any saved items.
                    </div>
                )}
            </div>
        </div >
    );
};

export default Saved;