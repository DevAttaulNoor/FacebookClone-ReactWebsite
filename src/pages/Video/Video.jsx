import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { Video_Saved } from "./Video_Saved";

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
        icon: ReactIcons.SAVED,
        path: Routes.VIDEO_SAVED.path
    },
]

const Video = () => {
    const location = useLocation();
    const { users } = useUsers();
    const { posts } = usePosts();
    const videoPosts = posts.filter(post => post.mediaType === 'video')

    return (
        <div className="w-full h-full flex">
            <LeftbarLayout title="Videos" icon={ReactIcons.SETTING}>
                <div className="flex flex-col gap-1">
                    {videosLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center p-2 gap-3 rounded-lg cursor-pointer`}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} text-2xl p-2 rounded-full`}>
                                        {data.icon}
                                    </span>
                                    <p className="font-medium">{data.title}</p>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </LeftbarLayout>

            <div className='flex-1 flex flex-col items-center p-4 gap-4 overflow-x-hidden overflow-y-auto'>
                {location.pathname === Routes.VIDEO.path && (
                    <FeedPost
                        userData={users}
                        postData={videoPosts}
                        postContainerStyle="w-2/3"
                    />
                )}

                {location.pathname === Routes.VIDEO_SAVED.path && (
                    <Video_Saved />
                )}
            </div>
        </div>
    );
};

export default Video;