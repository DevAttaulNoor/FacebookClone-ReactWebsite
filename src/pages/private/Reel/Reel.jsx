import { timeAgoInitials } from "@utils/TimeModule"
import { ProfileAvatar } from "@components/universal/ProfileAvatar"

const Reel = () => {
    return (
        <div className='w-full flex justify-center py-4 bg-black'>
            {/* <div
                style={{ backgroundImage: `url(${activeStoryData[activeStoryData.length - 1]?.background})` }}
                className="w-96 flex px-3 py-4 rounded-xl text-white bg-[#242526] bg-cover bg-center bg-no-repeat"
            >
                <div className="h-fit flex items-center gap-2">
                    <ProfileAvatar
                        userData={activeStoryUser}
                        imageStyleClass="w-10 h-10"
                        iconStyleClass="text-4xl"
                    />

                    <div className='flex flex-col'>
                        <h5 className="font-medium">{activeStoryUser?.username}</h5>
                        <p className="text-sm">{timeAgoInitials(activeStoryData[activeStoryData.length - 1]?.timestamp)}</p>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Reel