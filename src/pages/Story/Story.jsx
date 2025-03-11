import { Link, useParams } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useStories } from "@hooks/useStories"
import { useAuthUser } from "@hooks/useAuthUser"
import { ReactIcons } from "@constants/ReactIcons";

const Story = () => {
    const { id } = useParams();
    const { users } = useUsers();
    const { user } = useAuthUser();
    const { stories, userStories } = useStories(user.uid);
    const story = stories?.flatMap(data => data.stories).filter(elem => elem.uid === id)
    const userStory1 = users?.find(elem => elem.uid === story[story.length - 1].uid);
    const userStory = users?.find(elem => elem.uid === userStories[userStories.length - 1].uid);
    const storiesExceptCurrentUser = stories?.filter(data => data.uid !== user.uid)

    return (
        <div className="w-full h-full flex">
            <div className='relative w-[420px] flex flex-col p-2 gap-3 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between">
                    <h5 className="text-2xl font-bold">Stories</h5>
                    <span className="text-2xl p-2 rounded-full bg-customGray-default cursor-pointer hover:bg-customGray-100">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="font-semibold">Your story</h5>

                    {userStories.length > 0 ? (
                        <Link
                            to={`/story/${userStories[userStories.length - 1].uid}`}
                            className={`${(story[story.length - 1].uid === userStories[userStories.length - 1].uid) && 'bg-customGray-default'} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}
                        >
                            <div className='flex items-center gap-2'>
                                {userStory?.profilePhoto ? (
                                    <img
                                        src={userStory.profilePhoto}
                                        alt={`profile picture of ${userStory.username}`}
                                        className="w-14 h-14 rounded-full border border-customGray-100 object-contain bg-white"
                                    />
                                ) : (
                                    <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                                )}

                                <div className='flex flex-col gap-0.5'>
                                    <h5 className="font-medium">{userStory.username}</h5>
                                    <p className="text-sm">{userStories[userStories.length - 1].timestamp}</p>
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
                        <h5 className="font-semibold">All stories</h5>

                        {storiesExceptCurrentUser.map((data) => {
                            const storyUser = users.find(elem => elem.uid === data.uid);

                            return (
                                <Link
                                    key={data.uid}
                                    to={`/story/${data.uid}`}
                                    className={`${(story[story.length - 1].uid === data.uid) && 'bg-customGray-default'} flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-customGray-default`}
                                >
                                    <div className="flex items-center gap-2">
                                        {storyUser?.profilePhoto ? (
                                            <img
                                                src={storyUser.profilePhoto}
                                                alt={`profile picture of ${storyUser.username}`}
                                                className="w-14 h-14 rounded-full border border-customGray-100 object-contain bg-white"
                                            />
                                        ) : (
                                            <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                                        )}

                                        <div className='flex flex-col gap-0.5'>
                                            <h5 className="font-medium">{storyUser.username}</h5>
                                            <p className="text-sm">{data.stories[stories.length - 1].timestamp}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-sm font-medium text-customGray-300">There are no stories to be shown from friends and others</p>
                )}
            </div>

            <div className='w-full flex justify-center py-4 bg-black'>
                <div
                    style={{ backgroundImage: `url(${story[story.length - 1]?.background})` }}
                    className="w-96 flex px-3 py-4 rounded-xl text-white bg-[#242526] bg-cover bg-center bg-no-repeat"
                >
                    <div className="h-fit flex items-center gap-2">
                        {userStory1?.profilePhoto ? (
                            <img
                                src={userStory1?.profilePhoto}
                                alt={`profile picture of ${userStory1?.username}`}
                                className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                            />
                        ) : (
                            <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                        )}

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