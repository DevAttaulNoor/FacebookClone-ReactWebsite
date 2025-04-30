import { FriendCard } from "@components/friend-related/FriendCard"

const Friend_AllRequest = ({
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
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

export default Friend_AllRequest