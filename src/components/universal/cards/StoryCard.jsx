import { Link } from "react-router"
import { ProfileAvatar } from "../ProfileAvatar";

export const StoryCard = ({ userData, storyData }) => {
    const storyUser = userData.find(elem => elem.uid === storyData.uid);

    return (
        <Link
            to={`/story/${storyData.uid}`}
            className="relative w-24 h-40 flex flex-col justify-between p-2 rounded-xl z-0 bg-black xs:w-28 xs:h-44 sm:w-32 sm:h-56"
        >
            <ProfileAvatar
                userData={storyUser}
                imageStyleClass="w-[42px] h-[42px] border-[3px] !border-customBlue-default"
                iconStyleClass="text-[42px]"
            />

            <p className="text-xs font-medium px-1 drop-shadow-xl text-white">{storyUser.username}</p>

            <span
                style={{ backgroundImage: `url(${storyData.background})` }}
                className="absolute top-7 bottom-7 left-0 right-0 -z-[5] bg-cover bg-center bg-no-repeat"
            />
        </Link>
    )
}