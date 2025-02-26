import { Link, NavLink, useLocation } from "react-router-dom";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { FeedPost } from "@components/universal/FeedPost";
import { Profile_About } from "./Profile_About";
import { Profile_Friend } from "./Profile_Friend";
import { Profile_Photos } from "./Profile_Photos";
import { Profile_Video } from "./Profile_Video";
import { FeedPostPosting } from "@components/universal/FeedPostPosting";
import { ProfileComponentLayout } from "@layouts/ProfileComponentLayout";
import { useAuthUser } from "@hooks/useAuthUser";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";

const profileComponents = [
    { id: 1, title: 'Posts', path: Routes.PROFILE.path },
    { id: 2, title: 'About', path: Routes.PROFILE_ABOUT.path },
    { id: 3, title: 'Friends', path: Routes.PROFILE_FRIEND.path },
    { id: 4, title: 'Photos', path: Routes.PROFILE_PHOTO.path },
    { id: 5, title: 'Videos', path: Routes.PROFILE_VIDEO.path }
];

const Profile = () => {
    const location = useLocation();
    const user = useAuthUser();
    const { users } = useUsers();
    const { userPosts } = usePosts(user.uid);
    const userPostPhotos = userPosts.filter(data => data.mediaType === 'image')
    const userPostVideos = userPosts.filter(data => data.mediaType === 'video')

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    <img
                        src={user?.coverphoto}
                        alt={`cover image of ${user?.username}`}
                        className="w-full h-full object-cover object-center rounded-b-lg bg-customGray-default"
                    />
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full h-40 flex items-end justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={user?.profilePhoto}
                                alt={`profile image of ${user.username}`}
                                className="w-44 h-44 rounded-full border-2 border-white object-cover"
                            />

                            <span className="absolute bottom-2 right-2 p-2 text-lg bg-customGray-100 rounded-full cursor-pointer hover:bg-customGray-default">{ReactIcons.CAMERA}</span>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold">{user.username}</h3>

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
                                            src={data?.profilePhoto}
                                            alt={`profile image of ${data.username}`}
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
                                        src={user.profilePhoto}
                                        alt={`profile image of ${user.username}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {userPostPhotos.length > 0 && (
                                        <>
                                            {userPostPhotos.map((data) => (
                                                <img
                                                    key={data.id}
                                                    src={data.media}
                                                    alt={`image from post of ${data.username}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </ProfileComponentLayout>

                            {userPostVideos.length > 0 && (
                                <ProfileComponentLayout
                                    title={Routes.PROFILE_VIDEO.title}
                                    path={Routes.PROFILE_VIDEO.path}
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {userPostVideos.map((data) => (
                                            <video
                                                controls
                                                key={data.id}
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={data.media} type="video/mp4" />
                                            </video>
                                        ))}
                                    </div>
                                </ProfileComponentLayout>
                            )}

                            <ProfileComponentLayout
                                title={Routes.PROFILE_FRIEND.title}
                                path={Routes.PROFILE_FRIEND.path}
                            >
                                <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                                    {/* {user?.friends.map((data) => (
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
                                    ))} */}
                                </div>
                            </ProfileComponentLayout>
                        </div>

                        <div className="flex flex-[0.6] w-full flex-col gap-4">
                            <FeedPostPosting />

                            <FeedPost
                                userData={users}
                                postData={userPosts}
                            />
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
                    <Profile_Photos
                        userData={user}
                        userPhotosData={userPostPhotos}
                    />
                )}

                {location.pathname === Routes.PROFILE_VIDEO.path && (
                    <Profile_Video
                        userVideosData={userPostVideos}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;