import { NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";

const Saved = () => {
    const { user } = useAuth();
    const { posts } = usePosts();
    const { users } = useUsers();
    const savedPosts = posts.filter(post => post?.saves?.some(save => save.uid === user.uid));

    return (
        <div className="w-full h-full flex">
            <LeftbarLayout title="Saved" icon={ReactIcons.SETTING}>
                <NavLink
                    end
                    to={Routes.SAVED.path}
                    className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center p-2 gap-2 rounded-lg cursor-pointer`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} text-2xl p-2 rounded-full`}>
                                {ReactIcons.SAVED}
                            </span>
                            <p className="font-medium">Saved items</p>
                        </>
                    )}
                </NavLink>
            </LeftbarLayout>

            <div className='w-full flex flex-col px-16 py-4 gap-4 overflow-y-auto'>
                <h1 className="text-xl font-bold">All</h1>

                {savedPosts.length > 0 ? (
                    <>
                        {savedPosts?.map((data) => {
                            const savedPostUser = users.find(user => user.uid === data.uid);

                            return (
                                <div className='w-full h-40 flex p-3 gap-4 rounded-md shadow-customFull2 bg-white'>
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

                                            <div className='flex items-center gap-1'>
                                                <ProfileAvatar
                                                    userData={savedPostUser}
                                                    imageStyleClass='w-6 h-6'
                                                    iconStyleClass='text-xl'
                                                />

                                                <p className="text-xs text-customGray-300">Saved from</p>
                                                <span className="text-xs font-medium cursor-pointer hover:underline">{savedPostUser?.username}'s post</span>
                                            </div>
                                        </div>

                                        <div className='flex gap-2'>
                                            <button className="text-sm font-medium flex items-center justify-center py-2 px-8 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">Add to collection</button>

                                            <span className="flex items-center justify-center text-xl px-2 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div className="w-full h-24 flex items-center justify-center text-xl font-semibold p-3 gap-4 rounded-md shadow-customFull2 text-customGray-300 bg-white">
                        You do not have any saved items.
                    </div>
                )}
            </div>
        </div >
    );
};

export default Saved;