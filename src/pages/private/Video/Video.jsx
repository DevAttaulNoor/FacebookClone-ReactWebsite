import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { SvgIcons } from "@constants/SvgIcons";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import Video_Saved from "./Video_Saved";

const videosLeftbarOptions = [
    {
        id: 1,
        title: 'Home',
        icon: ReactIcons.VIDEO,
        path: Routes.VIDEO.path
    },
    {
        id: 2,
        title: 'Saved Videos',
        icon: SvgIcons.SAVED({ styleClass: 'w-[22px] h-[22px]' }),
        path: Routes.VIDEO_SAVED.path
    },
]

const Video = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { users } = useUsers();
    const { posts } = usePosts();
    const { acceptedFriends } = useFriends(user.uid);
    const friendsPosts = posts?.filter(data => acceptedFriends?.concat(user)?.some(friend => friend.uid === data.uid))
    const friendsVideoPosts = friendsPosts?.filter(data => data.mediaType === 'video')

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Videos" icon={ReactIcons.SETTING}>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1">
                    {videosLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between px-3.5 py-2 rounded-3xl cursor-pointer sm:p-2 sm:rounded-lg`}
                        >
                            {({ isActive }) => (
                                <div className="flex items-center gap-3">
                                    <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} hidden text-2xl p-2 rounded-full sm:block`}>
                                        {data.icon}
                                    </span>
                                    <p className={`${isActive && "text-customBlue-300"} font-medium sm:text-black`}>{data.title}</p>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </LeftbarLayout>

            <div className='flex-1 flex flex-col items-center p-4 gap-4 overflow-x-hidden overflow-y-auto'>
                {location.pathname === Routes.VIDEO.path && (
                    <FeedPost
                        activeUser={user}
                        userData={users}
                        postData={friendsVideoPosts}
                        postContainerStyle="feedPostWidth"
                    />
                )}

                {location.pathname === Routes.VIDEO_SAVED.path && (
                    <Video_Saved
                        activeUser={user}
                        userData={users}
                        postData={friendsVideoPosts}
                    />
                )}
            </div>
        </div>
    );
};

export default Video;