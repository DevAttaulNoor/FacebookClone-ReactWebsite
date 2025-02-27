import { ReactIcons } from "@constants/ReactIcons";

export const FriendCard = ({ usersData, friendsData, handleAddFriend, handleAcceptFriendRequest, handleDeclineFriendRequest }) => {
    const pendingRequest = friendsData.find(data => data.status === 'pending' && (data.senderUid === usersData.uid || data.receiverUid === usersData.uid));

    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white' >
            {usersData?.profilePhoto ? (
                <img
                    src={usersData?.profilePhoto}
                    alt={`image of ${usersData.username}`}
                    className="h-52 rounded-t-lg object-cover"
                />
            ) : (
                <span className="flex items-center justify-center text-8xl h-52 w-full rounded-t-lg object-cover bg-customGray-default">
                    {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                </span>
            )}

            <h5 className="font-medium px-3">{usersData.username}</h5>

            <div className='flex flex-col p-3 gap-2'>
                {pendingRequest ? (
                    <>
                        {pendingRequest.receiverUid === usersData.uid ? (
                            <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                                Pending
                            </button>
                        ) : (
                            <>
                                <button onClick={() => handleAcceptFriendRequest(usersData.uid)} className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                                    Accept
                                </button>

                                <button onClick={() => handleDeclineFriendRequest(usersData.uid)} className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default">
                                    Decline
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <button
                        onClick={() => handleAddFriend(usersData.uid)}
                        className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default"
                    >
                        Add friend
                    </button>
                )}
            </div>
        </div>
    )
}