import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "../ProfileAvatar";

export const StoryPostFeed = ({ userData, usersData, userRelatedStoriesData }) => {
    return (
        <>
            {userRelatedStoriesData.length > 0 ? (
                <div className='flex gap-2 overflow-x-auto overflow-y-hidden'>
                    <Link
                        to={Routes.STORY_CREATE.path}
                        className="w-24 h-40 flex flex-col rounded-xl bg-white xs:w-28 xs:h-44 sm:w-32 sm:h-56"
                    >
                        {userData?.profilePhoto ? (
                            <img
                                src={userData?.profilePhoto}
                                alt={`profile picture of ${userData?.username}`}
                                className="w-32 h-[82%] rounded-t-xl object-cover"
                            />
                        ) : (
                            <span className="flex items-center justify-center text-8xl h-[85%] w-full rounded-t-lg bg-customGray-default">
                                {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                            </span>
                        )}

                        <div className="flex flex-col items-center justify-center p-2 -mt-8">
                            <span className="text-base p-1 border-[3px] border-white rounded-full text-white bg-customBlue-default xs:text-lg  xs:p-1.5 sm:text-xl sm:p-2">
                                {ReactIcons.ADD_PLUS}
                            </span>
                            <h5 className="text-xs font-medium">Create story</h5>
                        </div>
                    </Link>

                    {userRelatedStoriesData
                        ?.sort((a, b) => b.timestamp - a.timestamp)
                        ?.reduce((acc, data) => {
                            if (!acc.some(item => item.uid === data.uid)) {
                                acc.push(data);
                            }
                            return acc;
                        }, [])
                        .map((data) => {
                            const storyUser = usersData?.find(user => user.uid === data?.uid);

                            return (
                                <Link
                                    key={data?.uid}
                                    to={`/story/${data?.uid}`}
                                    className="relative w-24 h-40 flex flex-col justify-between p-2 rounded-xl z-0 bg-black xs:w-28 xs:h-44 sm:w-32 sm:h-56"
                                >
                                    <ProfileAvatar
                                        userData={storyUser}
                                        imageStyleClass="w-[42px] h-[42px] border-[3px] !border-customBlue-default"
                                        iconStyleClass="text-[42px]"
                                    />

                                    <p className="text-xs font-medium px-1 drop-shadow-xl text-white">{storyUser?.username}</p>

                                    <span
                                        style={{ backgroundImage: `url(${data?.background})` }}
                                        className="absolute top-7 bottom-7 left-0 right-0 -z-[5] bg-cover bg-center bg-no-repeat"
                                    />
                                </Link>
                            )
                        })}
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
                </Link>
            )}
        </>
    )
}