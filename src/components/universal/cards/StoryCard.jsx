import { Link } from "react-router"
import { ProfileAvatar } from "../ProfileAvatar";

export const StoryCard = ({ userData, storyData }) => {
    const storyUser = userData.find(elem => elem.uid === storyData.uid);

    return (
        <Link
            to={`/story/${storyData.uid}`}
            className="relative min-w-32 h-56 flex flex-col justify-between p-2 rounded-xl shadow-xl z-0 bg-black"
        >
            <ProfileAvatar
                userData={storyUser}
                imageStyleClass="w-11 h-11 border-[3px] !border-customBlue-default"
                iconStyleClass="text-3xl"
            />

            <p className="text-xs font-medium px-1 drop-shadow-xl text-white">{storyUser.username}</p>

            <span
                style={{ backgroundImage: `url(${storyData.background})` }}
                className="absolute top-7 bottom-7 left-0 right-0 -z-[5] bg-cover bg-center bg-no-repeat"
            />
        </Link>
    )
}