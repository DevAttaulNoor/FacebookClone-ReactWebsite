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
                    className="bg-cover bg-center bg-no-repeat h-[200px] max-w-[1080px] w-full flex items-end justify-end p-1.5 rounded-b-lg bg-customGray-default xs:h-[240px] xs:p-2 sm:h-[280px] sm:p-2.5 md:h-[320px] md:p-3 lg:h-[360px] lg:p-3.5 xl:h-[400px] xl:p-4 2xl:h-[450px]"
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
                <div className="max-w-[1040px] w-full flex items-end justify-between p-1.5 -mt-10 xs:p-2 sm:p-2.5 md:p-3 md:-mt-14 lg:p-3.5 lg:-mt-16 xl:p-4 xl:-mt-[72px]">
                    <div className="flex flex-col items-center gap-1.5 xs:flex-row xs:items-end xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4">
                        <div className="relative">
                            <img
                                src={activeProfileUser?.profilePhoto}
                                alt={`profile image of ${activeProfileUser?.username}`}
                                className="w-24 h-24 rounded-full border-4 border-white object-cover xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44"
                            />

                            {activeProfileUser?.uid == user?.uid && (
                                <span
                                    onClick={() => profilePhotoRef.current.click()}
                                    className="absolute bottom-1 right-1 text-xs p-1.5 bg-customGray-100 rounded-full cursor-pointer hover:bg-customGray-default xs:bottom-1.5 xs:right-1.5 sm:text-sm md:bottom-2 md:right-2 md:text-base lg:bottom-2.5 lg:right-2.5 lg:p-2"
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

                        <div className={`${acceptedFriends?.length > 0 ? 'mb-0 sm:mb-1 xl:mb-2' : 'mb-14'} flex flex-col`}>
                            <h3 className="text-lg font-bold xs:text-xl sm:text-2xl lg:text-3xl">{activeProfileUser?.username}</h3>

                            {acceptedFriends?.length > 0 && (
                                <Link to={Routes.FRIEND_AllFRIENDS.path} className="w-fit text-xs md:text-sm text-customGray-200 cursor-pointer hover:underline">
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
                                            imageStyleClass="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9"
                                            iconStyleClass="text-3xl"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
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
                <div className="max-w-[1040px] w-full flex gap-1 px-1.5 border-t border-slate-400 xs:px-2 sm:px-2.5 md:px-3 lg:px-3.5 xl:px-4">
                    {profileComponents.map(({ id, title, path }) => (
                        <NavLink
                            end
                            key={id}
                            to={path}
                            className={({ isActive }) => {
                                const isActuallyActive = isActive || (id === 1 && location.pathname === `/profile/${activeProfileUser?.uid}`);
                                return `${isActuallyActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-xs font-semibold p-2 my-1 rounded-lg cursor-pointer xs:p-2.5 sm:p-3 md:text-sm lg:p-3.5 2xl:p-4`;
                            }}
                        >
                            {title}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Profile Page Components */}
            <div className="max-w-[1040px] w-full flex flex-col p-4 gap-4 sm:flex-row">
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
                                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-3">
                                    <img
                                        src={activeProfileUser?.profilePhoto}
                                        alt={`profile image of ${activeProfileUser?.username}`}
                                        className="max-h-32 h-full w-full shadow object-contain bg-slate-100 xs:max-h-36 sm:max-h-40"
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
                                    <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-3">
                                        {userPostVideos.map((data) => (
                                            <video
                                                controls
                                                key={data.id}
                                                className="max-h-32 h-full w-full shadow object-contain bg-slate-100 xs:max-h-36 sm:max-h-40"
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
                                    <div className="grid grid-cols-3 gap-x-2 gap-y-3 xs:grid-cols-4 xs:gap-x-3 sm:grid-cols-3">
                                        {acceptedFriends?.map((data) => (
                                            <Link
                                                key={data.uid}
                                                to={`/profile/${data.uid}`}
                                                className="flex flex-col gap-1"
                                            >
                                                <ProfileAvatar
                                                    userData={data}
                                                    imageStyleClass="max-h-32 h-full w-full shadow !rounded-lg object-contain !bg-slate-100 xs:max-h-36 sm:max-h-40"
                                                    iconStyleClass="text-3xl"
                                                />

                                                <p className="text-[10px] xs:text-xs font-medium">{data.username}</p>
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