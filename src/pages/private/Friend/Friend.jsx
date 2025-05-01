import { NavLink, useLocation } from "react-router";
import { setDoc, doc, updateDoc, deleteDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@services/firebase";
import { Routes } from "@constants/Routes";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { FriendCard } from "@components/friend-related/FriendCard";
import Friend_AllRequest from "./Friend_AllRequest";

const friendsLeftbarOptions = [
    {
        id: 1,
        title: 'Home',
        icon: ReactIcons.FRIENDS_STYLE2,
        path: Routes.FRIEND.path
    },
    {
        id: 2,
        title: Routes.FRIEND_AllREQUEST.title,
        icon: ReactIcons.FRIENDS_REQUEST,
        path: Routes.FRIEND_AllREQUEST.path
    },
    {
        id: 3,
        title: Routes.FRIEND_AllFRIENDS.title,
        icon: ReactIcons.FRIENDS_LIST,
        path: Routes.FRIEND_AllFRIENDS.path
    },
];

const Friend = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { friends, pendingFriends, acceptingFriends, acceptedFriends } = useFriends(user.uid);

    const handleAddFriend = async (friendId) => {
        try {
            // Create a friend request entry
            await setDoc(doc(db, "Users", user.uid, "Friends", friendId), {
                senderUid: user.uid,
                receiverUid: friendId,
                status: 'pending',
            });

            await updateDoc(doc(db, "Users", user.uid), {
                notifications: arrayUnion({
                    friendId: friendId,
                    status: 'pending',
                    timestamp: Math.floor(Date.now() / 1000),
                }),
            });

            // Add a request entry for the friend
            await setDoc(doc(db, "Users", friendId, "Friends", user.uid), {
                senderUid: user.uid,
                receiverUid: friendId,
                status: 'pending',
            });

            await updateDoc(doc(db, "Users", friendId), {
                notifications: arrayUnion({
                    friendId: user.uid,
                    status: 'pending',
                    timestamp: Math.floor(Date.now() / 1000),
                }),
            });

            console.log("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const userRef = doc(db, "Users", user.uid);
            const friendRef = doc(db, "Users", friendId);

            // Update the status of the friend request for both users
            await updateDoc(doc(db, "Users", user.uid, "Friends", friendId), {
                status: 'accepted',
            });

            await updateDoc(doc(db, "Users", friendId, "Friends", user.uid), {
                status: 'accepted',
            });

            // Fetch current user's notifications
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const updatedUserNotifications = userData.notifications?.filter(
                    (notification) => notification.friendId !== friendId
                );

                updatedUserNotifications.push({
                    friendId: friendId,
                    status: 'accepted',
                    timestamp: Math.floor(Date.now() / 1000),
                });

                await updateDoc(userRef, {
                    notifications: updatedUserNotifications,
                });
            }

            // Fetch friend's notifications
            const friendSnap = await getDoc(friendRef);
            if (friendSnap.exists()) {
                const friendData = friendSnap.data();
                const updatedFriendNotifications = friendData.notifications?.filter(
                    (notification) => notification.friendId !== user.uid
                );

                updatedFriendNotifications.push({
                    friendId: user.uid,
                    status: 'accepted',
                    timestamp: Math.floor(Date.now() / 1000),
                });

                await updateDoc(friendRef, {
                    notifications: updatedFriendNotifications,
                });
            }

            console.log("Friend request accepted successfully!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleDeclineFriendRequest = async (friendId) => {
        try {
            // Remove the friend request from both users' "Friends" collections
            await deleteDoc(doc(db, "Users", user.uid, "Friends", friendId));
            await deleteDoc(doc(db, "Users", friendId, "Friends", user.uid));

            // Get user and friend documents
            const userRef = doc(db, "Users", user.uid);
            const friendRef = doc(db, "Users", friendId);

            const userSnap = await getDoc(userRef);
            const friendSnap = await getDoc(friendRef);

            // Process the notifications for the current user
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const updatedUserNotifications = userData.notifications?.filter(
                    (notification) => notification.friendId !== friendId
                );

                if (updatedUserNotifications.length !== userData.notifications.length) {
                    await updateDoc(userRef, {
                        notifications: updatedUserNotifications
                    });
                }
            }

            // Process the notifications for the friend
            if (friendSnap.exists()) {
                const friendData = friendSnap.data();
                const updatedFriendNotifications = friendData.notifications?.filter(
                    (notification) => notification.friendId !== user.uid
                );

                if (updatedFriendNotifications.length !== friendData.notifications.length) {
                    await updateDoc(friendRef, {
                        notifications: updatedFriendNotifications
                    });
                }
            }

            console.log("Friend request declined successfully!");
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout title="Friends" icon={ReactIcons.SETTING}>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1">
                    {friendsLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between px-3.5 py-2 rounded-3xl cursor-pointer sm:p-2 sm:rounded-lg`}
                        >
                            {({ isActive }) => (
                                <div className="flex items-center gap-3">
                                    <span className={`${isActive ? "text-white bg-customBlue-300" : "bg-customGray-100"} hidden text-2xl p-2 rounded-full sm:block`}>
                                        {data.icon}
                                    </span>
                                    <p className={`${isActive && "text-customBlue-300"} font-medium sm:text-black`}>{data.title}</p>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </LeftbarLayout >

            <div className="flex-1 p-4 overflow-x-hidden overflow-y-auto sm:p-6 md:p-8 xl:p-10">
                {location.pathname === Routes.FRIEND.path && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold">People you may know</h1>

                        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {friends.map((data) => (
                                <FriendCard
                                    key={data.uid}
                                    userData={data}
                                    usersData={friends}
                                    friendsData={{
                                        pendingFriends: pendingFriends,
                                        acceptingFriends: acceptingFriends,
                                        acceptedFriends: acceptedFriends,
                                    }}
                                    handleAddFriend={handleAddFriend}
                                    handleAcceptFriendRequest={handleAcceptFriendRequest}
                                    handleDeclineFriendRequest={handleDeclineFriendRequest}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {location.pathname === Routes.FRIEND_AllREQUEST.path && (
                    <Friend_AllRequest
                        userData={acceptingFriends}
                        usersData={friends}
                        friendsData={{
                            pendingFriends: pendingFriends,
                            acceptingFriends: acceptingFriends,
                            acceptedFriends: acceptedFriends,
                        }}
                        handleAddFriend={handleAddFriend}
                        handleAcceptFriendRequest={handleAcceptFriendRequest}
                        handleDeclineFriendRequest={handleDeclineFriendRequest}
                    />
                )}
            </div>
        </div >
    );
};

export default Friend;
