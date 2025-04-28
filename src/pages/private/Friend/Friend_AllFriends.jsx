import { Link, NavLink, useLocation, useParams, Outlet } from "react-router-dom";
import { Routes } from "@constants/Routes";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { generatePath } from "@utils/PathResolver";
import { LeftbarLayout } from "@layouts/LeftbarLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";

const Friend_AllFriends = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { acceptedFriends } = useFriends(user?.uid);
    const viewingFriendProfile = id && location.pathname.includes(generatePath({ path: Routes.PROFILE.alternativePath }, { id: id }));

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

                        <h5 className="text-2xl font-extrabold leading-none">
                            {viewingFriendProfile ? "Friend Profile" : "All friends"}
                        </h5>
                    </div>

                    <hr className="w-full h-[1px] bg-customGray-100" />

                    <div className="flex flex-col gap-1">
                        <h6 className="font-medium px-2">{acceptedFriends.length} friends</h6>

                        {acceptedFriends?.map(data => (
                            <NavLink
                                key={data.uid}
                                to={`/friend/friendlist/${data.uid}`}
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

            <div className="h-full flex-1 overflow-x-hidden overflow-y-auto">
                {viewingFriendProfile ? (
                    <Outlet />
                ) : (
                    <div className="h-full flex items-center justify-center px-10">
                        Select people's names to preview their profile.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friend_AllFriends;