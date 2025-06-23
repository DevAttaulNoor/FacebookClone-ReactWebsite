import { Link, useParams } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useStories } from "@hooks/useStories";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { generatePath } from "@utils/PathResolver";
import { timeAgoInitials } from "@utils/TimeModule";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { StoryPost } from "@components/universal/post-related/StoryPost";

const Story = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const { acceptedFriends } = useFriends(user?.uid);
    const { stories, userStories } = useStories(user.uid);
    const activeStoryUser = users?.find(data => data.uid === id)
    const activeStoryData = stories?.filter(elem => elem.uid === id).sort((a, b) => a.timestamp - b.timestamp)
    const friendsStories = stories?.filter(data => acceptedFriends.some(friend => friend.uid === data.uid))

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Stories" icon={ReactIcons.SETTING}>
                <div className="flex flex-col mb-5 gap-2">
                    <h5 className="font-semibold px-2">Your story</h5>

                    {userStories.length > 0 ? (
                        <div className={`${userStories[userStories.length - 1].uid === id ? 'bg-customGray-default' : ''} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}>
                            <Link
                                to={generatePath({ path: Routes.STORY.path }, { id: userStories[userStories.length - 1]?.uid })}
                                className="flex items-center gap-3"
                            >
                                <ProfileAvatar
                                    userData={user}
                                    imageStyleClass="w-14 h-14"
                                    iconStyleClass="text-[56px]"
                                />

                                <div className='flex flex-col gap-0.5'>
                                    <h5 className="font-medium">{user.username}</h5>
                                    <p className="text-xs">{timeAgoInitials(userStories.sort((a, b) => a.timestamp - b.timestamp)[userStories.length - 1].timestamp)}</p>
                                </div>
                            </Link>

                            <Link
                                to={Routes.STORY_CREATE.path}
                                className="flex items-center text-3xl p-3 rounded-full text-customBlue-default bg-customGray-100"
                            >
                                {ReactIcons.ADD_PLUS}
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to={Routes.STORY_CREATE.path}
                            className='flex items-center p-2 gap-3 rounded-lg hover:bg-customGray-default'
                        >
                            <span className="flex items-center text-3xl p-3 rounded-full cursor-pointer text-customBlue-default bg-customGray-100">{ReactIcons.ADD_PLUS}</span>

                            <div className='flex flex-col'>
                                <h5 className="font-semibold">Create a story</h5>
                                <p className="text-sm font-medium text-customGray-300">Share a photo or write something.</p>
                            </div>
                        </Link>
                    )}
                </div>

                {friendsStories.filter(data => data.uid !== user.uid)?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        <h5 className="font-semibold px-2">All stories</h5>

                        {friendsStories
                            ?.filter(data => data.uid !== user.uid)
                            ?.sort((a, b) => b.timestamp - a.timestamp)
                            ?.reduce((acc, data) => {
                                if (!acc.some(item => item.uid === data.uid)) {
                                    acc.push(data);
                                }
                                return acc;
                            }, [])
                            ?.map((data) => {
                                const storyUser = users.find(elem => elem.uid === data.uid);

                                return (
                                    <Link
                                        key={data.uid}
                                        to={generatePath({ path: Routes.STORY.path }, { id: data.uid })}
                                        className={`${(data.uid === id) && 'bg-customGray-default'} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ProfileAvatar
                                                userData={storyUser}
                                                imageStyleClass="w-14 h-14"
                                                iconStyleClass="text-[56px]"
                                            />

                                            <div className='flex flex-col gap-0.5'>
                                                <h5 className="font-medium">{storyUser?.username}</h5>
                                                <p className="text-xs">{timeAgoInitials(data.timestamp)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                ) : (
                    <p className="text-sm font-medium text-customGray-300">There are no stories to be shown from friends and others</p>
                )}
            </LeftbarLayout>

            <div className='w-full flex justify-center py-4 bg-black'>
                <StoryPost
                    userData={activeStoryUser}
                    storyData={activeStoryData}
                />
            </div>
        </div>
    )
}

export default Story