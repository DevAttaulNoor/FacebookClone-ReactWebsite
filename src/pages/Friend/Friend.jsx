import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { FriendCard } from "@components/friend-related/FriendCard";
import { Friend_AllFriends } from "./Friend_AllFriends";
import { Friend_AllRequest } from "./Friend_AllRequest";

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
]

const Friend = () => {
    const location = useLocation();
    const user = useAuthUser();
    const { usersExceptCurrent } = useUsers(user.uid);

    return (
        <div className="w-full h-full flex">
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between pl-2 mb-2">
                    <p className="text-xl font-bold">Friends</p>

                    <span className="text-xl p-1.5 rounded-full bg-customGray-100 cursor-pointer hover:bg-slate-200">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex flex-col gap-1">
                    {friendsLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between p-2 rounded-lg cursor-pointer`}>
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
                            {usersExceptCurrent.map((data) => (
                                <FriendCard
                                    key={data.id}
                                    friendData={data}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {location.pathname === Routes.FRIEND_AllREQUEST.path && (
                    <Friend_AllRequest />
                )}

                {location.pathname === Routes.FRIEND_AllFRIENDS.path && (
                    <Friend_AllFriends />
                )}
            </div>
        </div>
    );
};

export default Friend;