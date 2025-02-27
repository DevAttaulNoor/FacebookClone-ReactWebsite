import { FriendCard } from "@components/friend-related/FriendCard"

export const Friend_AllRequest = () => {
    const user = useAuthUser();
    const { users } = useUsers();
    const { friends } = useFriends(user.uid);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">All the Requests</h1>

            <div className="grid grid-cols-5 gap-3">
                {usersExceptCurrent.map((user) => (
                    <FriendCard
                        key={user.uid}
                        usersData={user}
                        friendsData={pendingFriends}
                        handleAddFriend={handleAddFriend}
                        handleAcceptFriendRequest={handleAcceptFriendRequest}
                        handleDeclineFriendRequest={handleDeclineFriendRequest}
                    />
                ))}
            </div>
        </div>
    )
}