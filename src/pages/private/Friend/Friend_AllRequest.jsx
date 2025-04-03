import { FriendCard } from "@components/friend-related/FriendCard"

export const Friend_AllRequest = ({
    userData,
    usersData,
    friendsData,
    handleAddFriend,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">All the Requests</h1>

            <div className="grid grid-cols-5 gap-3">
                {userData.map((data) => (
                    <FriendCard
                        key={data.uid}
                        userData={data}
                        usersData={usersData}
                        friendsData={friendsData}
                        handleAddFriend={handleAddFriend}
                        handleAcceptFriendRequest={handleAcceptFriendRequest}
                        handleDeclineFriendRequest={handleDeclineFriendRequest}
                    />
                ))}
            </div>
        </div>
    )
}