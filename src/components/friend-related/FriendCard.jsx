import { ReactIcons } from "@constants/ReactIcons"

export const FriendCard = ({ friendData }) => {
    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white'>
            {friendData?.profilePhoto ? (
                <img
                    src={friendData?.profilePhoto}
                    alt={`image of ${friendData.username}`}
                    className="h-52 rounded-t-lg object-cover"
                />
            ) : (
                <span className="flex items-center justify-center text-8xl h-52 w-full rounded-t-lg object-cover bg-customGray-default">{ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}</span>
            )}

            <h5 className="font-medium px-3">{friendData.username}</h5>

            <div className='flex flex-col p-3 gap-2'>
                <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                    Add friend
                </button>

                <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default">
                    Remove
                </button>
            </div>
        </div>
    )
}