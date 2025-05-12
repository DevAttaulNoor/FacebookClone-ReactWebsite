import { FriendCard } from "@components/friend-related/FriendCard"

const Friend_AllRequest = ({ userData, usersData, friendsData }) => {
    return (
        <>
            {userData.length > 0 ? (
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">All the Requests</h1>

                    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {userData.map((data) => (
                            <FriendCard
                                key={data.uid}
                                userData={data}
                                usersData={usersData}
                                friendsData={friendsData}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center px-10">
                    When you have friend requests or suggestions, you'll see them here.
                </div>
            )}
        </>
    )
}

export default Friend_AllRequest