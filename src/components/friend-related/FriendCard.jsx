import { ReactIcons } from "@constants/ReactIcons"
import { BasicButton } from "@components/universal/buttons/BasicButton"

export const FriendCard = ({
    userData,
    usersData,
    friendsData,
    handleAddFriend,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest
}) => {
    return (
        <div className='max-w-72 w-full flex flex-col justify-between mx-auto gap-1.5 border rounded-lg shadow-customFull2 border-slate-300 bg-white'>
            <div className="flex flex-col gap-1.5">
                {userData?.profilePhoto ? (
                    <img
                        src={userData?.profilePhoto}
                        alt={`image of ${userData.username}`}
                        className="h-60 rounded-t-lg object-cover"
                    />
                ) : (
                    <span className="flex items-center justify-center text-8xl h-60 w-full rounded-t-lg object-cover bg-customGray-default">
                        {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                    </span>
                )}

                <h5 className="font-medium px-3">{userData.username}</h5>
            </div>

            <div className='flex flex-col p-3 gap-2'>
                {friendsData.pendingFriends.some(data => data.uid == userData.uid) && (
                    <BasicButton
                        btnStyleClass="text-customBlue-default bg-customBlue-100 hover:bg-customGray-default"
                        btnData={{
                            text: 'Pending',
                        }}
                    />
                )}

                {friendsData.acceptingFriends.some(data => data.uid == userData.uid) && (
                    <>
                        <BasicButton
                            btnStyleClass="text-customBlue-default bg-customBlue-100 hover:bg-customGray-default"
                            btnData={{
                                text: 'Accept',
                                onClick: () => handleAcceptFriendRequest(userData.uid)
                            }}
                        />

                        <BasicButton
                            btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                            btnData={{
                                text: 'Decline',
                                onClick: () => handleDeclineFriendRequest(userData.uid)
                            }}
                        />
                    </>
                )}

                {!friendsData.pendingFriends.some(data => data.uid == userData.uid) && usersData.some(data => data.uid == userData.uid) && (
                    <BasicButton
                        btnStyleClass="text-customBlue-default bg-customBlue-100 hover:bg-customGray-default"
                        btnData={{
                            text: 'Add friend',
                            onClick: () => handleAddFriend(userData.uid)
                        }}
                    />
                )}
            </div>
        </div>
    )
}