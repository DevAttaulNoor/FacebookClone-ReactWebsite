import { Link } from "react-router"
import { ReactIcons } from "@constants/ReactIcons"

export const StoryCard = ({ userData, storyData }) => {
    const storyUser = userData.find(elem => elem.uid === storyData.uid);
    const storiesLength = storyData.stories.length - 1

    return (
        <Link
            to={`/story/${storyData.uid}`}
            className="relative w-32 h-56 flex flex-col justify-between p-2 rounded-xl shadow-xl z-0 bg-black"
        >
            {storyUser?.profilePhoto ? (
                <img
                    src={storyUser.profilePhoto}
                    alt={`profile picture of ${storyUser.username}`}
                    className="w-11 h-11 rounded-full border-[3px] border-customBlue-default object-contain bg-customGray-200"
                />
            ) : (
                <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
            )}

            <p className="text-xs font-medium px-1 drop-shadow-xl text-white">{storyUser.username}</p>

            <span
                style={{ backgroundImage: `url(${storyData.stories[storiesLength].background})` }}
                className="absolute top-7 bottom-7 left-0 right-0 -z-[5] bg-cover bg-center bg-no-repeat"
            />
        </Link>
    )
}
