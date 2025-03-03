import { ReactIcons } from "@constants/ReactIcons";

export const FriendCard = ({
    userData,
    usersData,
    friendsData,
    handleAddFriend,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest
}) => {
    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white'>
            {userData?.profilePhoto ? (
                <img
                    src={userData?.profilePhoto}
                    alt={`image of ${userData.username}`}
                    className="h-52 rounded-t-lg object-cover"
                />
            ) : (
                <span className="flex items-center justify-center text-8xl h-52 w-full rounded-t-lg object-cover bg-customGray-default">
                    {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                </span>
            )}

            <h5 className="font-medium px-3">{userData.username}</h5>

            <div className='flex flex-col p-3 gap-2'>
                {friendsData.pendingFriends.some(data => data.uid == userData.uid) && (
                    <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                        Pending
                    </button>
                )}

                {friendsData.acceptingFriends.some(data => data.uid == userData.uid) && (
                    <>
                        <button onClick={() => handleAcceptFriendRequest(userData.uid)} className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                            Accept
                        </button>

                        <button onClick={() => handleDeclineFriendRequest(userData.uid)} className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default">
                            Decline
                        </button>
                    </>
                )}

                {!friendsData.pendingFriends.some(data => data.uid == userData.uid) && usersData.some(data => data.uid == userData.uid) && (
                    <button
                        onClick={() => handleAddFriend(userData.uid)}
                        className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default"
                    >
                        Add friend
                    </button>
                )}
            </div>
        </div>
    )
}