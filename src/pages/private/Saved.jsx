import { NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useReels } from "@hooks/useReels";
import { useGroups } from "@hooks/useGroups";
import { SvgIcons } from "@constants/SvgIcons";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { SavedPost } from "@components/universal/SavedPost";

const Saved = () => {
    const { user } = useAuth();
    const { users } = useUsers();
    const { posts } = usePosts();
    const { reels } = useReels();
    const { groups } = useGroups();
    const savedPosts = posts?.filter(post => post?.saves?.some(save => save.uid === user.uid));
    const savedReels = reels?.filter(reel => reel?.saves?.some(save => save.uid === user.uid));
    const savedEntity = savedReels.concat(savedPosts);

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
                        {savedEntity?.map((data) => {
                            const savedPostUser = users?.find(user => user.uid === data.uid);
                            const savedPostGroup = groups?.find(group => group.id === data.groupId)

                            return (
                                <SavedPost
                                    key={data.id}
                                    savedPostData={data}
                                    savedPostUser={savedPostUser}
                                    savedPostGroup={savedPostGroup}
                                />
                            )
                        })}
                    </>
                ) : (
                    <div className="w-full h-24 flex items-center justify-center text-center text-xl font-semibold p-3 gap-4 rounded-md shadow-customFull2 text-customGray-300 bg-white">
                        You do not have any saved items.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Saved;