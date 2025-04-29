import { useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useGroups } from "@hooks/useGroups";
import { useFriends } from "@hooks/useFriends";
import { SvgIcons } from "@constants/SvgIcons";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import Feed_Friend from "./Feed_Friend";

const feedLeftbarOptions = [
    {
        id: 1,
        title: 'All',
        icon: SvgIcons.FEED({ styleClass: 'w-6 h-6' }),
        path: Routes.FEED.path
    },
    {
        id: 2,
        title: 'Friends',
        icon: ReactIcons.FRIEND,
        path: Routes.FEED_FRIENDS.path
    },
];

const Feed = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { users } = useUsers();
    const { posts, groupPosts } = usePosts();
    const { acceptedFriends } = useFriends(user.uid);
    const { userRelatedGroups } = useGroups(user?.uid);
    const groupFeed = groupPosts.filter(data => userRelatedGroups.map(group => group.adminId === data.adminId))
    const userRelatedPosts = posts?.filter(data => (data.uid === user?.uid) || (acceptedFriends.some(friend => friend.uid === data.uid)));
    const allFeed = groupFeed.concat(userRelatedPosts)

    const friendFeed = useMemo(() => {
        if (!posts || !acceptedFriends) return [];

        const friendUids = new Set(acceptedFriends.map(friend => friend.uid));

        return posts.filter(post => friendUids.has(post.uid));
    }, [posts, acceptedFriends, user.uid]);

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Feeds">
                <div className="flex flex-col gap-1">
                    {feedLeftbarOptions.map((data) => (
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
                {location.pathname === Routes.FEED.path && (
                    <FeedPost
                        userData={users}
                        postData={allFeed}
                        groupData={userRelatedGroups}
                        usedInGroupPosting={true}
                        postContainerStyle="feedPostWidth"
                    />
                )}

                {location.pathname === Routes.FEED_FRIENDS.path && (
                    <Feed_Friend
                        userData={users}
                        postData={friendFeed}
                        postContainerStyle="feedPostWidth"
                    />
                )}
            </div>
        </div>
    )
}

export default Feed