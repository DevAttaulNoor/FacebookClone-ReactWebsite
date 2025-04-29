import { Link, NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";
import { timeAgo } from "@utils/TimeModule";
import { useGroups } from "@hooks/useGroups";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import Group_Joined from "./Group_Joined";
import Group_Discover from "./Group_Discover";
import group_coverphoto from '/Images/universal/group/group-coverphoto.png';

const groupsLeftbarOptions = [
    {
        id: 1,
        title: Routes.GROUP_FEED.title,
        icon: ReactIcons.GROUP,
        path: Routes.GROUP_FEED.path
    },
    {
        id: 2,
        title: Routes.GROUP_DISCOVER.title,
        icon: ReactIcons.GROUP,
        path: Routes.GROUP_DISCOVER.path
    },
    {
        id: 3,
        title: Routes.GROUP_JOINED.title,
        icon: ReactIcons.GROUP,
        path: Routes.GROUP_JOINED.path
    },
];

const Group_Feed = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { users } = useUsers();
    const { groupPosts } = usePosts();
    const { groups, userGroupsJoined, userGroupsCreated } = useGroups(user.uid);
    const userRelatedGroupsData = userGroupsJoined.concat(userGroupsCreated);
    const userRelatedGroupIds = userRelatedGroupsData.map(group => group.id);
    const groupJoinedPostsFeed = groupPosts?.filter(post => userRelatedGroupIds.includes(post.groupId));

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Groups" icon={ReactIcons.SETTING}>
                <div className="flex flex-col gap-1">
                    {groupsLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between p-2 rounded-lg cursor-pointer`}
                        >
                            {({ isActive }) => (
                                <div className="flex items-center gap-3">
                                    <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} text-2xl p-2 rounded-full`}>
                                        {data.icon}
                                    </span>
                                    <p className="font-medium">{data.title}</p>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="px-2 mt-3">
                    <BasicButton
                        btnStyleClass="text-customBlue-300 bg-customBlue-100 hover:bg-customGray-default"
                        btnData={{
                            link: Routes.GROUP_CREATE.path,
                            text: 'Create new group',
                            icon: ReactIcons.ADD_PLUS,
                            iconStyleClass: 'text-lg'
                        }}
                    />
                </div>

                {userGroupsCreated.length > 0 && (
                    <div className="flex flex-col pt-3 mt-4 gap-1 border-t">
                        <h5 className="font-semibold px-2">Groups you manage</h5>

                        {userGroupsCreated.map(data => (
                            <Link
                                key={data.id}
                                to={`/group/${data.id}`}
                                className="flex items-center p-2 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                {data?.coverPhoto ? (
                                    <img
                                        src={data?.coverPhoto}
                                        alt={`cover photo of ${data?.name}`}
                                        className="w-12 h-12 border rounded-lg object-cover"
                                    />
                                ) : (
                                    <img
                                        src={group_coverphoto}
                                        alt="image of group"
                                        className="w-12 h-12 border rounded-lg object-cover"
                                    />
                                )}

                                <div>
                                    <h5 className="text-sm font-medium">{data?.name}</h5>
                                    <p className="text-xs text-customGray-200 cursor-pointer">{timeAgo(data?.timestamp)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {userGroupsJoined.length > 0 && (
                    <div className="flex flex-col pt-3 mt-4 gap-1 border-t">
                        <div className="flex justify-between px-2">
                            <h5 className="font-semibold">Groups you've joined</h5>

                            <Link
                                to={Routes.GROUP_JOINED.path}
                                className="text-sm font-light cursor-pointer text-customBlue-300 hover:underline"
                            >
                                see all
                            </Link>
                        </div>

                        {userGroupsJoined.map(data => (
                            <Link
                                key={data.id}
                                to={`/group/${data.id}`}
                                className="flex items-center p-2 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                {data?.coverPhoto ? (
                                    <img
                                        src={data?.coverPhoto}
                                        alt={`cover photo of ${data?.name}`}
                                        className="w-12 h-12 border rounded-lg object-cover"
                                    />
                                ) : (
                                    <img
                                        src={group_coverphoto}
                                        alt="image of group"
                                        className="w-12 h-12 border rounded-lg object-cover"
                                    />
                                )}

                                <div>
                                    <h5 className="text-sm font-medium">{data?.name}</h5>
                                    <p className="text-xs text-customGray-200 cursor-pointer">{timeAgo(data?.timestamp)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </LeftbarLayout >

            <div className="flex-1 p-8 overflow-x-hidden overflow-y-auto">
                {location.pathname === Routes.GROUP_FEED.path && (
                    <div className="flex flex-col items-center gap-4">
                        <FeedPost
                            activeUser={user}
                            userData={users}
                            postData={groupJoinedPostsFeed}
                            groupData={userRelatedGroupsData}
                            usedInGroupPosting={true}
                            postContainerStyle="feedPostWidth"
                        />
                    </div>
                )}

                {location.pathname === Routes.GROUP_DISCOVER.path && (
                    <Group_Discover
                        userData={user}
                        groupsData={groups}
                    />
                )}

                {location.pathname === Routes.GROUP_JOINED.path && (
                    <Group_Joined
                        userData={user}
                        groupsData={groups}
                    />
                )}
            </div>
        </div>
    )
}

export default Group_Feed