import { NavLink, useLocation } from "react-router";
import { db } from "@services/firebase";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useFriends } from "@hooks/useFriends";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { Friend_AllRequest } from "./Friend_AllRequest";
import { Friend_AllFriends } from "./Friend_AllFriends";
import { FriendCard } from "@components/friend-related/FriendCard";
import { setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

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
    const user = useAuthUser();
    const location = useLocation();
    const { friends, pendingFriends, acceptingFriends, acceptedFriends } = useFriends(user.uid);

    // Send Friend Request
    const handleAddFriend = async (friendId) => {
        try {
            // Create a friend request entry
            await setDoc(doc(db, "Users", user.uid, "Friends", friendId), {
                senderUid: user.uid,
                receiverUid: friendId,
                status: 'pending',
            });

            // Add a request entry for the friend
            await setDoc(doc(db, "Users", friendId, "Friends", user.uid), {
                senderUid: user.uid,
                receiverUid: friendId,
                status: 'pending',
            });

            console.log("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    // Accept Friend Request
    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const requestRef = doc(db, "Users", user.uid, "Friends", friendId);
            const friendRequestRef = doc(db, "Users", friendId, "Friends", user.uid);

            // Update the status of the friend request
            await updateDoc(requestRef, {
                status: 'accepted',
            });

            await updateDoc(friendRequestRef, {
                status: 'accepted',
            });

            console.log("Friend request accepted successfully!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    // Decline Friend Request
    const handleDeclineFriendRequest = async (friendId) => {
        try {
            const requestRef = doc(db, "Users", user.uid, "Friends", friendId);
            const friendRequestRef = doc(db, "Users", friendId, "Friends", user.uid);

            // Remove the request
            await deleteDoc(requestRef);
            await deleteDoc(friendRequestRef);

            console.log("Friend request declined successfully!");
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    // Filter users
    // const ReqsPendingState = usersExceptCurrent.filter(data =>
    //     pendingFriends.some(user => user.receiverUid === data.uid)
    // );

    // const ReqsAcceptingState = usersExceptCurrent.filter(data =>
    //     pendingFriends.some(user => user.senderUid === data.uid)
    // );

    // const ReqsAcceptedState = usersExceptCurrent.filter(data =>
    //     acceptedFriends.some(user => user.id === data.uid)
    // );

    // const FriendsTobeMade = usersExceptCurrent.filter(data => ![...ReqsAcceptingState, ...ReqsAcceptedState].some(user => user.uid === data.uid));

    // console.log(pendingFriends, 'pendingFriends')
    // console.log(acceptedFriends, 'acceptedFriends')
    // console.log(ReqsPendingState, 'ReqsPendingState')
    // console.log(ReqsAcceptingState, 'ReqsAcceptingState')
    // console.log(ReqsAcceptedState, 'ReqsAcceptedState')
    // console.log(FriendsTobeMade, 'FriendsTobeMade')

    return (
        <div className="w-full h-full flex">
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between pl-2 mb-2">
                    <p className="text-xl font-bold">Friends</p>
                    <span className="text-xl p-1.5 rounded-full bg-customGray-100 cursor-pointer hover:bg-slate-200">
                        {ReactIcons.SETTING}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    {friendsLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) =>
                                `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between p-2 rounded-lg cursor-pointer`
                            }>
                            <div className="flex items-center gap-2">
                                <span className="text-xl p-1.5 rounded-full bg-customGray-100">{data.icon}</span>
                                <p className="font-medium">{data.title}</p>
                            </div>
                            <span className="text-lg text-customGray-200">{ReactIcons.DOWN}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className='w-full h-full p-12 overflow-x-hidden overflow-y-auto'>
                {location.pathname === Routes.FRIEND.path && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold">People you may know</h1>

                        <div className="grid grid-cols-5 gap-3">
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

                {location.pathname === Routes.FRIEND_AllFRIENDS.path && (
                    <Friend_AllFriends
                        userData={acceptedFriends}
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
        </div>
    );
};

export default Friend;