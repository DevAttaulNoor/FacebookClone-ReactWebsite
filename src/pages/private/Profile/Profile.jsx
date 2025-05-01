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
import { getActiveRoute, getPreferredPath } from "@utils/PathResolver";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { ProfileComponentLayout } from "@layouts/ProfileComponentLayout";
import { TextareaField } from "@components/universal/inputs/TextareaField";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";

const Profile = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const coverPhotoRef = useRef(null);
    const profilePhotoRef = useRef(null);
    const activeProfileUser = users?.find(data => data.uid === id);
    const { userPosts } = usePosts(activeProfileUser?.uid);
    const { acceptedFriends } = useFriends(activeProfileUser?.uid);
    const userPostPhotos = userPosts.filter(data => data.mediaType === 'image')
    const userPostVideos = userPosts.filter(data => data.mediaType === 'video')
    const [bioInput, setBioInput] = useState({
        value: "",
        count: 101,
        isVisible: false,
    });

    const profileComponents = [
        {
            id: 1,
            title: 'Posts',
            path: getPreferredPath(Routes.PROFILE, { id: activeProfileUser?.uid }, location.pathname)
        },
        {
            id: 2,
            title: 'About',
            path: getPreferredPath(Routes.PROFILE_ABOUT, { id: activeProfileUser?.uid }, location.pathname)
        },
        {
            id: 3,
            title: 'Friends',
            path: getPreferredPath(Routes.PROFILE_FRIEND, { id: activeProfileUser?.uid }, location.pathname)
        },
        {
            id: 4,
            title: 'Photos',
            path: getPreferredPath(Routes.PROFILE_PHOTO, { id: activeProfileUser?.uid }, location.pathname)
        },
        {
            id: 5,
            title: 'Videos',
            path: getPreferredPath(Routes.PROFILE_VIDEO, { id: activeProfileUser?.uid }, location.pathname)
        },
    ];

    const handleBioText = async () => {
        try {
            const userDocRef = doc(db, "Users", user.uid);
            await updateDoc(userDocRef, { bio: bioInput.value });
            setBioInput((prev) => ({ ...prev, isVisible: false }));
        } catch (error) {
            console.error(`Error uploading bio text`, error);
        }
    };

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

    return (
        <div className="w-full h-full flex flex-col items-center overflow-y-auto">
            <div className="w-full flex flex-col items-center px-4 shadow bg-white">
                {/* Cover Photo */}
                <div
                    style={{ backgroundImage: `url(${activeProfileUser?.coverPhoto})` }}
                    className="w-full max-w-[1080px] h-[300px] flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default sm:h-[340px] md:h-[380px] lg:h-[400px] xl:h-[420px] 2xl:h-[460px]"
                >
                    {activeProfileUser?.uid === user?.uid && (
                        <>
                            <BasicButton
                                btnStyleClass="!w-fit z-[5] bg-white hover:bg-slate-50"
                                btnData={{
                                    text: activeProfileUser?.coverPhoto ? 'Edit cover photo' : 'Add cover photo',
                                    icon: activeProfileUser?.coverPhoto ? ReactIcons.EDIT_PENCIL : ReactIcons.ADD_PLUS,
                                    onClick: () => coverPhotoRef.current.click(),
                                }}
                            />

                            <input
                                ref={coverPhotoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                            />
                        </>
                    )}
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full flex items-end justify-between p-4 -mt-16">
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            <img
                                src={activeProfileUser?.profilePhoto}
                                alt={`profile image of ${activeProfileUser?.username}`}
                                className="w-44 h-44 rounded-full border-4 border-white object-cover"
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

                            {acceptedFriends?.length > 0 && (
                                <Link to={Routes.FRIEND_AllFRIENDS.path} className="w-fit text-sm text-customGray-200 cursor-pointer hover:underline">
                                    {`${acceptedFriends?.length} ${acceptedFriends?.length > 1 ? 'friends' : 'friend'}`}
                                </Link>
                            )}

                            <div className="flex items-center mt-1">
                                {acceptedFriends?.slice(0, 8).map((data) => (
                                    <Link
                                        key={data.uid}
                                        to={`/profile/${data.uid}`}
                                        className="rounded-full border-2 border-white -mr-3 last:-mr-0"
                                    >
                                        <ProfileAvatar
                                            userData={data}
                                            imageStyleClass="w-10 h-10"
                                            iconStyleClass="text-3xl"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {activeProfileUser?.uid == user?.uid ? (
                            <>
                                <BasicButton
                                    btnStyleClass="text-white bg-customBlue-default"
                                    btnData={{
                                        link: Routes.STORY_CREATE.path,
                                        text: 'Add to story',
                                        icon: ReactIcons.ADD_PLUS,
                                    }}
                                />

                                <BasicButton
                                    btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                    btnData={{
                                        text: 'Edit profile',
                                        icon: ReactIcons.EDIT_PENCIL,
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {acceptedFriends?.some(data => data.uid == user?.uid) ? (
                                    <BasicButton
                                        btnStyleClass="text-white bg-customBlue-default"
                                        btnData={{
                                            text: 'Friend',
                                            icon: ReactIcons.FRIEND,
                                        }}
                                    />
                                ) : (
                                    <BasicButton
                                        btnStyleClass="text-white bg-customBlue-default"
                                        btnData={{
                                            link: Routes.FRIEND.path,
                                            text: 'Add friend',
                                            icon: ReactIcons.FRIEND_ADD,
                                        }}
                                    />
                                )}

                                <BasicButton
                                    btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                    btnData={{
                                        text: 'Message',
                                        icon: ReactIcons.MESSAGE,
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="max-w-[1040px] w-full flex gap-1 px-4 border-t border-slate-400">
                    {profileComponents.map(({ id, title, path }) => (
                        <NavLink
                            end
                            key={id}
                            to={path}
                            className={({ isActive }) => {
                                const isActuallyActive = isActive || (id === 1 && location.pathname === `/profile/${activeProfileUser?.uid}`);
                                return `${isActuallyActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-sm font-semibold p-4 my-1 rounded-lg cursor-pointer`;
                            }}
                        >
                            {title}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Profile Page Components */}
            <div className="max-w-[1040px] w-full flex p-4 gap-4">
                {getActiveRoute(Routes.PROFILE, location.pathname, { id: activeProfileUser?.uid }) && (
                    <>
                        <div className="flex flex-[0.4] flex-col gap-4">
                            {activeProfileUser?.uid == user?.uid ? (
                                <ProfileComponentLayout
                                    path={getPreferredPath(Routes.PROFILE_ABOUT, { id: activeProfileUser?.uid }, location.pathname)}
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

                                            <BasicButton
                                                btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                                btnData={{
                                                    text: `${activeProfileUser.bio ? 'Edit' : 'Add'} bio`,
                                                    onClick: () => setBioInput(prev => ({ ...prev, isVisible: !prev.isVisible }))
                                                }}
                                            />
                                        </>
                                    )}

                                    <div className={`${bioInput.isVisible ? 'flex' : 'hidden'} justify-end gap-2`}>
                                        <BasicButton
                                            btnStyleClass="text-white bg-customBlue-default"
                                            btnData={{
                                                text: 'Save',
                                                onClick: handleBioText
                                            }}
                                        />

                                        <BasicButton
                                            btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                            btnData={{
                                                text: 'Cancel',
                                                onClick: () => setBioInput(prev => ({ ...prev, isVisible: false }))
                                            }}
                                        />
                                    </div>
                                </ProfileComponentLayout>
                            ) : (
                                <>
                                    {activeProfileUser?.bio && (
                                        <ProfileComponentLayout
                                            path={getPreferredPath(Routes.PROFILE_ABOUT, { id: activeProfileUser?.uid }, location.pathname)}
                                            title={Routes.PROFILE_ABOUT.title}
                                            noSeeAll={false}
                                        >
                                            <p className="text-sm text-center">{activeProfileUser?.bio}</p>
                                        </ProfileComponentLayout>
                                    )}
                                </>
                            )}

                            <ProfileComponentLayout
                                path={getPreferredPath(Routes.PROFILE_PHOTO, { id: activeProfileUser?.uid }, location.pathname)}
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
                                    path={getPreferredPath(Routes.PROFILE_VIDEO, { id: activeProfileUser?.uid }, location.pathname)}
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
                                    path={getPreferredPath(Routes.PROFILE_FRIEND, { id: activeProfileUser?.uid }, location.pathname)}
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
                            {user?.uid === activeProfileUser?.uid && (
                                <FeedPostPosting />
                            )}

                            <FeedPost
                                userData={users}
                                postData={userPosts}
                            />
                        </div>
                    </>
                )}

                {getActiveRoute(Routes.PROFILE_ABOUT, location.pathname, { id: activeProfileUser?.uid }) && (
                    <Profile_About />
                )}

                {getActiveRoute(Routes.PROFILE_FRIEND, location.pathname, { id: activeProfileUser?.uid }) && (
                    <Profile_Friend
                        friendsData={acceptedFriends}
                    />
                )}

                {getActiveRoute(Routes.PROFILE_PHOTO, location.pathname, { id: activeProfileUser?.uid }) && (
                    <Profile_Photos
                        userData={activeProfileUser}
                        userPhotosData={userPostPhotos}
                    />
                )}

                {getActiveRoute(Routes.PROFILE_VIDEO, location.pathname, { id: activeProfileUser?.uid }) && (
                    <Profile_Video
                        userVideosData={userPostVideos}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;