import { ProfileAvatar } from "../ProfileAvatar"
import { timeAgoInitials } from "@utils/TimeModule"

export const StoryPost = ({ userData, storyData }) => {
    return (
        <div
            style={{ backgroundImage: `url(${storyData[storyData.length - 1]?.background})` }}
            className="w-96 flex px-3 py-4 rounded-xl text-white bg-[#242526] bg-cover bg-center bg-no-repeat"
        >
            <div className="h-fit flex items-center gap-2">
                <ProfileAvatar
                    userData={userData}
                    imageStyleClass="w-10 h-10"
                    iconStyleClass="text-4xl"
                />

                <div className='flex flex-col'>
                    <h5 className="font-medium">{userData?.username}</h5>
                    <p className="text-sm">{timeAgoInitials(storyData[storyData.length - 1]?.timestamp)}</p>
                </div>
            </div>
        </div>
    )
}