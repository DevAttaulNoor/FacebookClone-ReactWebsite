import { FriendCard } from "@components/friend-related/FriendCard"
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { ReactIcons } from "@constants/ReactIcons"
import { Routes } from "@constants/Routes";
import { useAuth } from "@contexts/AuthContext";
import { useFriends } from "@hooks/useFriends";
import { LeftbarLayout } from "@layouts/LeftbarLayout"
import { Link, NavLink, useLocation, useParams } from "react-router";
import Profile from "../Profile/Profile";

const Friend_AllFriends = () => {
    const { id } = useParams()
    const { user } = useAuth();
    const location = useLocation();
    const { friends, pendingFriends, acceptingFriends, acceptedFriends } = useFriends(user.uid);

    return (
        <div className="pageWithLeftbarStyle">
            <LeftbarLayout>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            to={Routes.FRIEND.path}
                            className="text-xl p-2.5 rounded-full cursor-pointer hover:bg-customGray-default"
                        >
                            {ReactIcons.ARROW_LEFT}
                        </Link>

                        <h5 className="text-2xl font-extrabold leading-none">All friends</h5>
                    </div>

                    <hr className="w-full h-[1px] bg-customGray-100" />

                    <div className="flex flex-col gap-1">
                        <h6 className="font-medium px-2">{acceptedFriends.length} friends</h6>

                        {acceptedFriends?.map(data => (
                            <NavLink
                                key={data.id}
                                to={`/friend/friendlist/${data.id}`}
                                className="flex items-center p-2 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                <ProfileAvatar
                                    userData={data}
                                    imageStyleClass='w-16 h-16'
                                    iconStyleClass='text-5xl'
                                />

                                <p className="font-medium">{data?.username}</p>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </LeftbarLayout>

            {location.pathname === Routes.FRIEND_AllFRIENDS.path && (
                <div className="h-full flex-1 flex items-center justify-center px-10 overflow-x-hidden overflow-y-auto">
                    Select people's names to preview their profile.
                </div>
            )}

            {location.pathname === `/friend/friendlist/${id}` && (
                <div className="h-full flex-1 overflow-x-hidden overflow-y-auto">
                    <Profile />
                </div>
            )}
        </div>
    )
}

export default Friend_AllFriends