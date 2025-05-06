import { useLocation, useParams } from "react-router";
import { useUsers } from "@hooks/useUsers";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useGroups } from "@hooks/useGroups";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { formatJoinedDate } from "@utils/TimeModule";
import { generatePath, getActiveRoute } from "@utils/PathResolver";
import { GroupComponentLayout } from "@layouts/GroupComponentLayout";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";
import { EntityInformationSection } from "@sections/universal/EntityInformationSection";
import Group_About from "./Group_About";
import Group_Media from "./Group_Media";
import Group_People from "./Group_People";

const Group = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const { groupPosts } = usePosts();
    const { groups, userRelatedGroups } = useGroups(user?.uid);
    const activeGroup = groups?.find(data => data.id === id);
    const activeGroupPosts = groupPosts?.filter(data => data.groupId === activeGroup?.id)

    const groupComponents = [
        { id: 1, title: 'About', path: generatePath({ path: Routes.GROUP_ABOUT.path }, { id: id }) },
        { id: 2, title: 'Discussion', path: generatePath({ path: Routes.GROUP.path }, { id: id }) },
        { id: 3, title: 'People', path: generatePath({ path: Routes.GROUP_PEOPLE.path }, { id: id }) },
        { id: 4, title: 'Media', path: generatePath({ path: Routes.GROUP_MEDIA.path }, { id: id }) },
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

    return (
        <div className="w-full h-full flex flex-col items-center overflow-y-auto">
            <EntityInformationSection
                location={location}
                entityType='group'
                entityData={{
                    activeEntityData: activeGroup,
                    activeEntityRelatedData: userRelatedGroups
                }}
                componentsData={groupComponents}
            />

            {/* Group Page Components */}
            <div className="max-w-[1040px] w-full p-4">
                {getActiveRoute(Routes.GROUP, location.pathname, { id: id }) && (
                    <div className="flex flex-col-reverse gap-4 sm:flex-row">
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
                    </div>
                )}

                {getActiveRoute(Routes.GROUP_ABOUT, location.pathname, { id: id }) && (
                    <Group_About
                        usersData={users}
                        groupData={activeGroup}
                    />
                )}

                {getActiveRoute(Routes.GROUP_PEOPLE, location.pathname, { id: id }) && (
                    <Group_People
                        usersData={users}
                        groupData={activeGroup}
                    />
                )}

                {(getActiveRoute(Routes.GROUP_MEDIA, location.pathname, { id: id }) ||
                    (getActiveRoute(Routes.GROUP_MEDIA_PHOTO, location.pathname, { id: id })) ||
                    (getActiveRoute(Routes.GROUP_MEDIA_VIDEO, location.pathname, { id: id }))) && (
                        <Group_Media
                            groupPosts={activeGroupPosts}
                        />
                    )}
            </div>
        </div>
    )
}

export default Group