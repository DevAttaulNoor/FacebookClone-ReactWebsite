import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";
import { useFriends } from "@hooks/useFriends";
import { Profile_About } from "./Profile_About";
import { Profile_Video } from "./Profile_Video";
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@services/firebase";
import { Profile_Photos } from "./Profile_Photos";
import { Profile_Friend } from "./Profile_Friend";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { ProfileComponentLayout } from "@layouts/ProfileComponentLayout";
import { TextareaField } from "@components/universal/inputs/TextareaField";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";

const Profile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const activeProfileUser = users?.find(data => data.uid === id);
    const { userPosts } = usePosts(activeProfileUser?.uid);
    const { acceptedFriends } = useFriends(activeProfileUser?.uid);
    const userPostPhotos = userPosts.filter(data => data.mediaType === 'image')
    const userPostVideos = userPosts.filter(data => data.mediaType === 'video')
    const location = useLocation();
    const coverPhotoRef = useRef(null);
    const profilePhotoRef = useRef(null);

    const [bioInput, setBioInput] = useState({
        value: "",
        count: 101,
        isVisible: false,
    });

    const profileComponents = [
        { id: 1, title: 'Posts', path: `/profile/${activeProfileUser?.uid}` },
        { id: 2, title: 'About', path: `/profile/${activeProfileUser?.uid}/about` },
        { id: 3, title: 'Friends', path: `/profile/${activeProfileUser?.uid}/friend` },
        { id: 4, title: 'Photos', path: `/profile/${activeProfileUser?.uid}/photo` },
        { id: 5, title: 'Videos', path: `/profile/${activeProfileUser?.uid}/video` },
    ];

    const handlePhotoChange = async (photoType, photoTypeRef) => {
        const file = photoTypeRef.current.files[0];
        if (file) {
            try {
                let photo;
                const storageRef = ref(storage, `Users/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                photo = await getDownloadURL(storageRef);

                const userDocRef = doc(db, "Users", user.uid);

                if (photoType === "profilePhoto") {
                    await updateDoc(userDocRef, { profilePhoto: photo });
                } else if (photoType === "coverPhoto") {
                    await updateDoc(userDocRef, { coverPhoto: photo });
                } else {
                    console.error(`Invalid photoType: ${photoType}`);
                }

                console.log(`Success uploading ${photoType}`);
            } catch (error) {
                console.error(`Error uploading ${photoType}:`, error);
            }
        }
    };

    const handleBioText = async () => {
        try {
            const userDocRef = doc(db, "Users", user.uid);
            await updateDoc(userDocRef, { bio: bioInput.value });
            setBioInput((prev) => ({ ...prev, isVisible: false }));
        } catch (error) {
            console.error(`Error uploading bio text`, error);
        }
    };

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    {activeProfileUser?.coverPhoto ? (
                        <div
                            style={{ backgroundImage: `url(${activeProfileUser?.coverPhoto})` }}
                            className="w-full h-full flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default"
                        >
                            {activeProfileUser?.uid === user?.uid && (
                                <button
                                    onClick={() => coverPhotoRef.current.click()}
                                    className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-white hover:bg-customGray-default z-[5]"
                                >
                                    <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>
                                    <p className="text-sm font-semibold">Edit cover photo</p>

                                    <input
                                        type="file"
                                        ref={coverPhotoRef}
                                        accept="image/*"
                                        onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                                        className="hidden"
                                    />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            style={{ backgroundImage: `url(${activeProfileUser?.coverPhoto})` }}
                            className="w-full h-full flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default"
                        >
                            {activeProfileUser?.uid === user?.uid && (
                                <button
                                    onClick={() => coverPhotoRef.current.click()}
                                    className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-white hover:bg-customGray-100 z-[5]"
                                >
                                    <span className="text-lg">{ReactIcons.ADD_PLUS}</span>
                                    <p className="text-sm font-semibold">Add cover photo</p>

                                    <input
                                        type="file"
                                        ref={coverPhotoRef}
                                        accept="image/*"
                                        onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                                        className="hidden"
                                    />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full flex items-end justify-between p-4 -mt-20">
                    <div className="flex items-end gap-4">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={activeProfileUser?.profilePhoto}
                                alt={`profile image of ${activeProfileUser?.username}`}
                                className="w-44 h-44 rounded-full border-2 border-white object-cover"
                            />

                            {activeProfileUser?.uid == user?.uid && (
                                <span
                                    onClick={() => profilePhotoRef.current.click()}
                                    className="absolute bottom-2 right-2 p-2 text-lg bg-customGray-100 rounded-full cursor-pointer hover:bg-customGray-default"
                                >
                                    {ReactIcons.CAMERA}

                                    <input
                                        type="file"
                                        ref={profilePhotoRef}
                                        accept="image/*"
                                        onChange={() => handlePhotoChange('profilePhoto', profilePhotoRef)}
                                        className="hidden"
                                    />
                                </span>
                            )}
                        </div>

                        <div className={`${acceptedFriends?.length > 0 ? 'mb-2' : 'mb-14'} flex flex-col`}>
                            <h3 className="text-[28px] font-bold">{activeProfileUser?.username}</h3>

                            {/* Friends Count */}
                            {acceptedFriends?.length > 0 && (
                                <Link to={Routes.FRIEND_AllFRIENDS.path} className="w-fit text-sm text-customGray-200 cursor-pointer hover:underline">
                                    {`${acceptedFriends?.length} ${acceptedFriends?.length > 1 ? 'friends' : 'friend'}`}
                                </Link>
                            )}

                            {/* Friends List Preview */}
                            <div className="flex items-center mt-1">
                                {acceptedFriends?.slice(0, 8).map((data) => (
                                    <Link
                                        key={data.uid}
                                        to={`/profile/${data.uid}`}
                                        className="rounded-full border-2 border-white -ml-2 first:-ml-0"
                                    >
                                        <ProfileAvatar
                                            userData={data}
                                            imageStyleClass="w-8 h-8"
                                            iconStyleClass="text-2xl"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {activeProfileUser?.uid == user?.uid ? (
                            <>
                                <Link
                                    to={Routes.STORY_CREATE.path}
                                    className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer text-white bg-customBlue-default"
                                >
                                    <span className="text-lg">{ReactIcons.ADD_PLUS}</span>
                                    <p className="text-sm font-semibold">Add to story</p>
                                </Link>

                                <button
                                    className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                                >
                                    <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>
                                    <p className="text-sm font-semibold">Edit profile</p>
                                </button>
                            </>
                        ) : (
                            <>
                                {acceptedFriends?.some(data => data.uid == user?.uid) ? (
                                    <span className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer text-white bg-customBlue-default">
                                        <span className="text-lg">{ReactIcons.FRIEND}</span>
                                        <p className="text-sm font-semibold">Friend</p>
                                    </span>
                                ) : (
                                    <Link
                                        to={Routes.FRIEND.path}
                                        className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer text-white bg-customBlue-default"
                                    >
                                        <span className="text-lg">{ReactIcons.FRIEND_ADD}</span>
                                        <p className="text-sm font-semibold">Add friend</p>
                                    </Link>
                                )}

                                <button
                                    className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                                >
                                    <span className="text-lg">{ReactIcons.MESSAGE}</span>
                                    <p className="text-sm font-semibold">Message</p>
                                </button>
                            </>
                        )}
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
            <div className="max-w-[1040px] w-full flex p-4 gap-4">
                {location.pathname === `/profile/${activeProfileUser?.uid}` && (
                    <>
                        <div className="flex flex-[0.4] flex-col gap-4">
                            {activeProfileUser?.uid == user?.uid ? (
                                <ProfileComponentLayout
                                    path={`/profile/${activeProfileUser?.uid}/about`}
                                    title={Routes.PROFILE_ABOUT.title}
                                    noSeeAll={false}
                                >
                                    {bioInput.isVisible ? (
                                        <div className="flex flex-col rounded-lg">
                                            <TextareaField
                                                textareaData={{
                                                    rows: 3,
                                                    value: bioInput.value,
                                                    maxLength: bioInput.count,
                                                    placeholder: 'Describe who you are',
                                                    onChange: (e) => setBioInput(prev => ({ ...prev, value: e.target.value })),
                                                }}
                                                textareaStyle="text-center text-sm font-medium py-2 px-3 rounded-lg border-2 resize-none cursor-pointer bg-customGray-default hover:bg-customGray-100"
                                            />

                                            <p className="text-end text-xs font-medium text-customGray-300">
                                                {bioInput.count - bioInput.value.length} characters limit
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-center">{activeProfileUser?.bio}</p>
                                            <button
                                                onClick={() => setBioInput(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                                                className="w-full text-sm font-medium py-2.5 rounded-lg bg-customGray-100 hover:bg-customGray-default"
                                            >
                                                {`${activeProfileUser.bio ? 'Edit' : 'Add'} bio`}
                                            </button>
                                        </>
                                    )}

                                    <div className={`${bioInput.isVisible ? 'flex' : 'hidden'} justify-end gap-2`}>
                                        <button
                                            onClick={handleBioText}
                                            className="text-sm font-medium py-2 px-4 rounded-lg text-white bg-customBlue-default"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => setBioInput(prev => ({ ...prev, isVisible: false }))}
                                            className="text-sm font-medium py-2 px-4 rounded-lg bg-customGray-100"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </ProfileComponentLayout>
                            ) : (
                                <>
                                    {activeProfileUser?.bio && (
                                        <ProfileComponentLayout
                                            path={`/profile/${activeProfileUser?.uid}/about`}
                                            title={Routes.PROFILE_ABOUT.title}
                                            noSeeAll={false}
                                        >
                                            <p className="text-sm text-center">{activeProfileUser?.bio}</p>
                                        </ProfileComponentLayout>
                                    )}
                                </>
                            )}

                            <ProfileComponentLayout
                                path={`/profile/${activeProfileUser?.uid}/photo`}
                                title={Routes.PROFILE_PHOTO.title}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <img
                                        src={activeProfileUser?.profilePhoto}
                                        alt={`profile image of ${activeProfileUser?.username}`}
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
                                    path={`/profile/${activeProfileUser?.uid}/video`}
                                    title={Routes.PROFILE_VIDEO.title}
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

                            {acceptedFriends.length > 0 && (
                                <ProfileComponentLayout
                                    path={`/profile/${activeProfileUser?.uid}/friend`}
                                    title={Routes.PROFILE_FRIEND.title}
                                >
                                    <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                                        {acceptedFriends?.map((data) => (
                                            <Link
                                                key={data.uid}
                                                to={`/profile/${data.uid}`}
                                                className="flex flex-col gap-1"
                                            >
                                                <ProfileAvatar
                                                    userData={data}
                                                    imageStyleClass="w-full h-full !rounded-lg"
                                                    iconStyleClass="text-3xl"
                                                />

                                                <p className="text-xs font-medium">{data.username}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </ProfileComponentLayout>
                            )}
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

                {location.pathname === `/profile/${activeProfileUser?.uid}/about` && (
                    <Profile_About />
                )}

                {location.pathname === `/profile/${activeProfileUser?.uid}/friend` && (
                    <Profile_Friend
                        friendsData={acceptedFriends}
                    />
                )}

                {location.pathname === `/profile/${activeProfileUser?.uid}/photo` && (
                    <Profile_Photos
                        userData={activeProfileUser}
                        userPhotosData={userPostPhotos}
                    />
                )}

                {location.pathname === `/profile/${activeProfileUser?.uid}/video` && (
                    <Profile_Video
                        userVideosData={userPostVideos}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;