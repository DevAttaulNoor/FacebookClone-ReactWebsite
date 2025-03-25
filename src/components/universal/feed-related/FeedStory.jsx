import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useStories } from "@hooks/useStories";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { StoryCard } from "../cards/StoryCard";

export const FeedStory = () => {
    const { user } = useAuthUser();
    const { users } = useUsers();
    const { stories } = useStories();

    return (
        <>
            {stories.length > 0 ? (
                <div className='flex gap-2 overflow-x-auto overflow-y-hidden'>
                    <Link
                        to={Routes.STORY_CREATE.path}
                        className="min-w-32 h-56 flex flex-col rounded-xl shadow-xl bg-white"
                    >
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt={`profile picture of ${user.username}`}
                                className="w-full h-[82%] rounded-t-xl object-cover"
                            />
                        ) : (
                            <span className="flex items-center justify-center text-8xl h-[85%] w-full rounded-t-lg bg-customGray-default">
                                {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                            </span>
                        )}

                        <div className="flex flex-col items-center justify-center p-2 -mt-8">
                            <span className="text-xl p-2 border-[3px] border-white rounded-full text-white bg-customBlue-default">
                                {ReactIcons.ADD_PLUS}
                            </span>
                            <h5 className="text-xs font-medium">Create story</h5>
                        </div>
                    </Link>

                    {stories.map((data) => (
                        <StoryCard
                            key={data.uid}
                            storyData={data}
                            userData={users}
                        />
                    ))}
                </div>
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