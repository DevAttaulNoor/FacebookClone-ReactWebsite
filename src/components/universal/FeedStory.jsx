import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useStories } from "@hooks/useStories";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";

export const FeedStory = () => {
    const user = useAuthUser();
    const { users } = useUsers();
    const { stories } = useStories();

    return (
        <>
            {stories.length > 0 ? (
                <div className='flex gap-2'>
                    <Link
                        to={Routes.STORY_CREATE.path}
                        className="w-36 h-60 flex flex-col justify-between rounded-xl shadow-xl bg-white"
                    >
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt={`profile picture of ${user.username}`}
                                className="w-full h-full rounded-t-xl object-cover"
                            />
                        ) : (
                            <span className="flex items-center justify-center text-8xl h-52 w-full rounded-t-lg object-cover bg-customGray-default">
                                {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                            </span>
                        )}

                        <div className='flex flex-col items-center justify-center p-2 -mt-5 rounded-b-xl'>
                            <span className="text-xl p-2 border-[3px] border-white rounded-full text-white bg-customBlue-default">{ReactIcons.ADD_PLUS}</span>
                            <h5 className="text-xs font-medium">Create story</h5>
                        </div>
                    </Link>

                    {stories.map((data) => {
                        const storyUser = users.find(elem => elem.uid === data.uid);
                        const storiesLength = data.stories.length - 1

                        return (
                            <Link
                                key={data.uid}
                                to={`/story/${data.uid}`}
                                style={{ backgroundImage: `url(${data.stories[storiesLength].background})` }}
                                className="w-36 h-60 flex flex-col justify-between p-3 rounded-xl shadow-xl bg-cover bg-center"
                            >
                                {storyUser?.profilePhoto ? (
                                    <img
                                        src={storyUser.profilePhoto}
                                        alt={`profile picture of ${storyUser.username}`}
                                        className="w-8 h-8 rounded-full border-2 border-customBlue-default object-contain bg-white"
                                    />
                                ) : (
                                    <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                                )}

                                <p className="text-xs font-medium text-white">{storyUser.username}</p>
                            </Link>
                        )
                    })}
                </div >
            ) : (
                <Link
                    to={Routes.STORY_CREATE.path}
                    className='w-full flex items-center p-2 rounded-lg shadow-customFull2 bg-white cursor-pointer group'
                >
                    <div className="w-full flex items-center p-2 gap-2.5 rounded-lg group-hover:bg-customGray-default">
                        <span className="text-2xl p-2 rounded-full text-customBlue-default bg-customGray-100">{ReactIcons.ADD_PLUS}</span>

                        <div className='reelFeedInfo'>
                            <h2 className="text-lg font-semibold">Create Story</h2>
                            <p className="text-sm text-customGray-200">Share a photo or write something.</p>
                        </div>
                    </div>
                </Link >
            )}
        </>
    )
}