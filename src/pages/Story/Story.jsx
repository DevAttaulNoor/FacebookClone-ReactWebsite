import { Link, useParams } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useStories } from "@hooks/useStories"
import { useAuthUser } from "@hooks/useAuthUser"
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";

const Story = () => {
    const { id } = useParams();
    const { users } = useUsers();
    const { user } = useAuthUser();
    const { stories, userStories } = useStories(user.uid);
    const story = stories?.flatMap(data => data.stories).filter(elem => elem.uid === id)
    const userStory1 = users?.find(elem => elem.uid === story[story.length - 1]?.uid);
    const userStory = users?.find(elem => elem.uid === userStories[userStories.length - 1]?.uid);
    const storiesExceptCurrentUser = stories?.filter(data => data.uid !== user.uid)

    return (
        <div className="w-full h-full flex">
            <LeftbarLayout title="Stories" icon={ReactIcons.SETTING}>
                <div className="flex flex-col mb-5 gap-2">
                    <h5 className="font-semibold px-2">Your story</h5>

                    {userStories.length > 0 ? (
                        <Link
                            to={`/story/${userStories[userStories.length - 1].uid}`}
                            className={`${(story[story.length - 1].uid === userStories[userStories.length - 1].uid) && 'bg-customGray-default'} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}
                        >
                            <div className='flex items-center gap-3'>
                                <ProfileAvatar
                                    userData={userStory}
                                    imageStyleClass="w-14 h-14"
                                    iconStyleClass="text-[56px]"
                                />

                                <div className='flex flex-col gap-0.5'>
                                    <h5 className="font-medium">{userStory.username}</h5>
                                    <p className="text-xs">{userStories[userStories.length - 1].timestamp}</p>
                                </div>
                            </div>

                            <Link
                                to={Routes.STORY_CREATE.path}
                                className="flex items-center text-3xl p-3 rounded-full cursor-pointer text-customBlue-default bg-customGray-100"
                            >
                                {ReactIcons.ADD_PLUS}
                            </Link>
                        </Link>
                    ) : (
                        <Link
                            to={Routes.STORY_CREATE.path}
                            className='flex items-center justify-between p-2 rounded-lg'
                        >
                            <span className="flex items-center text-3xl p-3 cursor-pointer text-customBlue-default bg-customGray-default">{ReactIcons.ADD_PLUS}</span>

                            <div className='flex flex-col'>
                                <h5 className="font-semibold">Create a story</h5>
                                <p className="text-sm font-medium text-customGray-300">Share a photo or write something.</p>
                            </div>
                        </Link>
                    )}
                </div>

                {storiesExceptCurrentUser.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        <h5 className="font-semibold px-2">All stories</h5>

                        {storiesExceptCurrentUser.map((data) => {
                            const storyUser = users.find(elem => elem.uid === data.uid);

                            return (
                                <Link
                                    key={data.uid}
                                    to={`/story/${data.uid}`}
                                    className={`${(story[story.length - 1].uid === data.uid) && 'bg-customGray-default'} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ProfileAvatar
                                            userData={storyUser}
                                            imageStyleClass="w-14 h-14"
                                            iconStyleClass="text-[56px]"
                                        />

                                        <div className='flex flex-col gap-0.5'>
                                            <h5 className="font-medium">{storyUser.username}</h5>
                                            <p className="text-xs">{data.stories[stories.length - 1].timestamp}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-sm font-medium text-customGray-300">There are no stories to be shown from friends and others</p>
                )}
            </LeftbarLayout>

            <div className='w-full flex justify-center py-4 bg-black'>
                <div
                    style={{ backgroundImage: `url(${story[story.length - 1]?.background})` }}
                    className="w-96 flex px-3 py-4 rounded-xl text-white bg-[#242526] bg-cover bg-center bg-no-repeat"
                >
                    <div className="h-fit flex items-center gap-2">
                        <ProfileAvatar
                            userData={userStory1}
                            imageStyleClass="w-10 h-10"
                            iconStyleClass="text-4xl"
                        />


                        <div className='flex flex-col'>
                            <h5 className="font-medium">{userStory1?.username}</h5>
                            <p className="text-sm">{story[story.length - 1]?.timestamp}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Story