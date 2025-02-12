import { Link, NavLink, useLocation } from "react-router-dom";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { FeedPost } from "@components/universal/FeedPost";
import { Profile_About } from "./Profile_About";
import { Profile_Friend } from "./Profile_Friend";
import { Profile_Photos } from "./Profile_Photos";
import { Profile_Video } from "./Profile_Video";
import { ProfileComponentLayout } from "@layouts/ProfileComponentLayout";
import userData from "@assets/data/universal/Users.json";

const profileComponents = [
    { id: 1, title: 'Posts', path: Routes.PROFILE.path },
    { id: 2, title: 'About', path: Routes.PROFILE_ABOUT.path },
    { id: 3, title: 'Friends', path: Routes.PROFILE_FRIEND.path },
    { id: 4, title: 'Photos', path: Routes.PROFILE_PHOTO.path },
    { id: 5, title: 'Videos', path: Routes.PROFILE_VIDEO.path }
];

const feedPostingOptions = [
    {
        id: 1,
        title: "Live video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg",
    },
    {
        id: 2,
        title: "Photo/video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j",
    },
    {
        id: 3,
        title: "Feeling/activity",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77",
    },
];

const Profile = () => {
    const user = userData[0];
    const location = useLocation();

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    <img
                        src={user.coverphoto}
                        alt={`cover image of ${user.name}`}
                        className="w-full h-full object-cover object-center rounded-b-lg bg-customGray-default"
                    />
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full h-40 flex items-end justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={user.profilephoto}
                                alt={`profile image of ${user.name}`}
                                className="w-44 h-44 rounded-full border-2 border-white object-cover"
                            />

                            <span className="absolute bottom-2 right-2 p-2 text-lg bg-customGray-100 rounded-full cursor-pointer hover:bg-customGray-default">{ReactIcons.CAMERA}</span>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold">{user.name}</h3>

                            {/* Friends Count */}
                            {user.friends?.length > 0 && (
                                <Link to={Routes.FRIEND_AllFRIENDS.path} className="text-sm text-customGray-200 cursor-pointer hover:underline">
                                    {`${user.friends.length} ${user.friends.length > 1 ? 'friends' : 'friend'}`}
                                </Link>
                            )}

                            {/* Friends List Preview */}
                            <div className="flex items-center mt-2">
                                {user.friends?.slice(0, 8).map((data) => (
                                    <Link
                                        key={data.id}
                                        to={Routes.PROFILE.path}
                                        className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:-ml-0"
                                    >
                                        <img
                                            src={data.profilephoto}
                                            alt={`profile image of ${data.name}`}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                        <div className="flex items-center px-3 py-2 rounded-md cursor-pointer bg-customGray-100">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/r2FA830xjtI.png" alt="" />
                            <p className="text-sm font-semibold ml-1">Add friend</p>
                        </div>

                        <div className="flex items-center px-3 py-2 rounded-md cursor-pointer text-white bg-customBlue-default">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/YjBUcSAL8TC.png" alt="" />
                            <p className="text-sm font-semibold ml-1">Message</p>
                        </div>

                        <div className="flex items-center px-3 py-2 rounded-md cursor-pointer bg-customGray-100">
                            <span>{ReactIcons.DOWN}</span>
                        </div>
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="max-w-[1040px] w-full flex items-center justify-between px-4 border-t border-slate-400">
                    <div className="flex gap-1">
                        {profileComponents.map((data) => (
                            <NavLink
                                end
                                key={data.id}
                                to={data.path}
                                className={({ isActive }) => `${isActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-sm font-semibold p-4 my-1 rounded-lg cursor-pointer`}
                            >
                                {data.title}
                            </NavLink>
                        ))}
                    </div>

                    <span className="text-xl cursor-pointer">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            {/* Profile Page Components */}
            <div className="max-w-[1040px] w-full flex p-4 gap-3">
                {location.pathname === Routes.PROFILE.path && (
                    <>
                        <div className="flex flex-[0.4] flex-col gap-4">
                            <ProfileComponentLayout
                                title={Routes.PROFILE_ABOUT.title}
                                path={Routes.PROFILE_ABOUT.path}
                                noSeeAll={false}
                            >
                                <p className="text-sm text-center">{user?.bio}</p>
                            </ProfileComponentLayout>

                            <ProfileComponentLayout
                                title={Routes.PROFILE_PHOTO.title}
                                path={Routes.PROFILE_PHOTO.path}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <img
                                        src={user.coverphoto}
                                        alt={`cover image of ${user.name}`}
                                        className="w-full h-full object-cover"
                                    />

                                    <img
                                        src={user.profilephoto}
                                        alt={`profile image of ${user.name}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </ProfileComponentLayout>

                            {/* <ProfileComponentLayout
                        title={Routes.PROFILE_VIDEO.title}
                        path={Routes.PROFILE_VIDEO.path}
                    >
                        <div className="grid grid-cols-3 gap-2">
                            <video controls>
                                <source src={url} type="video/mp4" />
                            </video>
                        </div>
                    </ProfileComponentLayout> */}

                            <ProfileComponentLayout
                                title={Routes.PROFILE_FRIEND.title}
                                path={Routes.PROFILE_FRIEND.path}
                            >
                                <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                                    {user.friends.map((data) => (
                                        <Link
                                            key={data.id}
                                            to={Routes.PROFILE.path}
                                            className="flex flex-col gap-1"
                                        >
                                            <img
                                                src={data.profilephoto}
                                                alt={`profile image of ${data.name}`}
                                                className="w-full h-full rounded-md"
                                            />

                                            <p className="text-xs font-medium">{data.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            </ProfileComponentLayout>
                        </div>

                        <div className="flex flex-[0.6] w-full flex-col gap-4">
                            <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
                                <div className="flex items-center gap-2 py-3">
                                    <span className="text-4xl">
                                        {ReactIcons.PROFILE_AVATAR}
                                    </span>

                                    <div className="w-full cursor-pointer rounded-3xl bg-customGray-default px-3 py-2.5 hover:bg-[#E4E6EB]">
                                        <p className="text-slate-500">{`What's on your mind, dumpy`}</p>
                                    </div>
                                </div>

                                <div className="h-[1px] w-full bg-slate-100"></div>

                                <div className="grid grid-cols-3 gap-1 py-2">
                                    {feedPostingOptions.map((data) => (
                                        <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                                            <img src={data.icon} alt={""} className="w-5" />
                                            <p className="text-sm font-medium text-[#65676B]">
                                                Live video
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <FeedPost />
                        </div>
                    </>
                )}

                {location.pathname === Routes.PROFILE_ABOUT.path && (
                    <Profile_About />
                )}

                {location.pathname === Routes.PROFILE_FRIEND.path && (
                    <Profile_Friend />
                )}

                {location.pathname === Routes.PROFILE_PHOTO.path && (
                    <Profile_Photos />
                )}

                {location.pathname === Routes.PROFILE_VIDEO.path && (
                    <Profile_Video />
                )}
            </div>
        </div>
    );
};

export default Profile;