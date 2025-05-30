import { Link, NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";
import { timeAgo } from "@utils/TimeModule";
import { useGroups } from "@hooks/useGroups";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed";
import Group_Joined from "./Group_Joined";
import Group_Discover from "./Group_Discover";
import group_coverphoto from '/Images/universal/group/group-coverphoto.png';
import { GroupList } from "@components/group-related/GroupList";

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
    const { groups, userGroupsJoined, userGroupsCreated, userRelatedGroups } = useGroups(user?.uid);
    const groupJoinedPostsFeed = groupPosts.filter(data => userRelatedGroups.some(group => group.id === data.groupId));

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Groups" icon={ReactIcons.SETTING}>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1">
                    {groupsLeftbarOptions.map((data) => (
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
                    <GroupList
                        title={"Groups you manage"}
                        groupsData={userGroupsCreated}
                    />
                )}

                {userGroupsJoined.length > 0 && (
                    <GroupList
                        title={"Groups you've joined"}
                        titleLink={Routes.GROUP_JOINED.path}
                        groupsData={userGroupsJoined}
                    />
                )}
            </LeftbarLayout >

            <div className="flex-1 p-4 overflow-x-hidden overflow-y-auto sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10">
                {location.pathname === Routes.GROUP_FEED.path && (
                    <div className="flex flex-col items-center gap-4">
                        <RegularPostFeed
                            userData={user}
                            usersData={users}
                            postsData={groupJoinedPostsFeed}
                            groupData={userRelatedGroups}
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
                        groupsData={userRelatedGroups}
                    />
                )}
            </div>
        </div>
    )
}

export default Group_Feed