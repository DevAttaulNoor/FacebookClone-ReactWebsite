import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useLocation, useParams } from "react-router-dom";
import { db } from "@services/firebase";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { usePosts } from "@hooks/usePosts";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { getActiveRoute, getPreferredPath } from "@utils/PathResolver";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { ProfileComponentLayout } from "@layouts/ProfileComponentLayout";
import { TextareaField } from "@components/universal/inputs/TextareaField";
import { EntityInformation } from "@components/universal/EntityInformation";
import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed";
import { PostingRegularPost } from "@components/universal/post-related/PostingRegularPost";
import { RegularPostSkeleton } from "@components/universal/loading-skeletons/RegularPostSkeleton";
import Profile_About from "./Profile_About";
import Profile_Video from "./Profile_Video";
import Profile_Photos from "./Profile_Photos";
import Profile_Friend from "./Profile_Friend";

const Profile = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { users, userCurrent } = useUsers(id);
    const { userPosts, postsLoading } = usePosts(userCurrent?.uid);
    const { acceptedFriends } = useFriends(userCurrent?.uid);
    const userPostPhotos = userPosts?.filter(data => data.mediaType === 'image')
    const userPostVideos = userPosts?.filter(data => data.mediaType === 'video')
    const [bioInput, setBioInput] = useState({
        value: "",
        count: 101,
        isVisible: false,
    });

    const profileComponents = [
        {
            id: 1,
            title: 'Posts',
            path: getPreferredPath(Routes.PROFILE, { id: userCurrent?.uid }, location.pathname)
        },
        {
            id: 2,
            title: 'About',
            path: getPreferredPath(Routes.PROFILE_ABOUT, { id: userCurrent?.uid }, location.pathname)
        },
        {
            id: 3,
            title: 'Friends',
            path: getPreferredPath(Routes.PROFILE_FRIEND, { id: userCurrent?.uid }, location.pathname)
        },
        {
            id: 4,
            title: 'Photos',
            path: getPreferredPath(Routes.PROFILE_PHOTO, { id: userCurrent?.uid }, location.pathname)
        },
        {
            id: 5,
            title: 'Videos',
            path: getPreferredPath(Routes.PROFILE_VIDEO, { id: userCurrent?.uid }, location.pathname)
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

    return (
        <div className="w-full h-full flex flex-col items-center overflow-y-auto">
            <EntityInformation
                location={location}
                entityType='profile'
                entityData={{
                    activeEntityData: userCurrent,
                    activeEntityFriends: acceptedFriends,
                }}
                componentsData={profileComponents}
            />

            {/* Profile Page Components */}
            <div className="max-w-[1040px] w-full p-4">
                {getActiveRoute(Routes.PROFILE, location.pathname, { id: userCurrent?.uid }) && (
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-[0.4] flex-col gap-4">
                            {userCurrent?.uid == user?.uid ? (
                                <ProfileComponentLayout
                                    path={getPreferredPath(Routes.PROFILE_ABOUT, { id: userCurrent?.uid }, location.pathname)}
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
                                            <p className="text-sm text-center">{userCurrent?.bio}</p>

                                            <BasicButton
                                                btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                                btnData={{
                                                    text: `${userCurrent.bio ? 'Edit' : 'Add'} bio`,
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
                                    {userCurrent?.bio && (
                                        <ProfileComponentLayout
                                            path={getPreferredPath(Routes.PROFILE_ABOUT, { id: userCurrent?.uid }, location.pathname)}
                                            title={Routes.PROFILE_ABOUT.title}
                                            noSeeAll={false}
                                        >
                                            <p className="text-sm text-center">{userCurrent?.bio}</p>
                                        </ProfileComponentLayout>
                                    )}
                                </>
                            )}

                            <ProfileComponentLayout
                                path={getPreferredPath(Routes.PROFILE_PHOTO, { id: userCurrent?.uid }, location.pathname)}
                                title={Routes.PROFILE_PHOTO.title}
                            >
                                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-3">
                                    <img
                                        src={userCurrent?.profilePhoto}
                                        alt={`profile image of ${userCurrent?.username}`}
                                        className="w-full shadow object-contain bg-slate-100"
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
                                    path={getPreferredPath(Routes.PROFILE_VIDEO, { id: userCurrent?.uid }, location.pathname)}
                                    title={Routes.PROFILE_VIDEO.title}
                                >
                                    <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-3">
                                        {userPostVideos.map((data) => (
                                            <video
                                                controls
                                                key={data.id}
                                                className="w-full shadow object-contain bg-slate-100"
                                            >
                                                <source src={data.media} type="video/mp4" />
                                            </video>
                                        ))}
                                    </div>
                                </ProfileComponentLayout>
                            )}

                            {acceptedFriends.length > 0 && (
                                <ProfileComponentLayout
                                    path={getPreferredPath(Routes.PROFILE_FRIEND, { id: userCurrent?.uid }, location.pathname)}
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
                                                    imageStyleClass="w-full shadow !rounded-sm object-contain !bg-slate-100"
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
                            {user?.uid === userCurrent?.uid && (
                                <PostingRegularPost
                                    userData={user}
                                />
                            )}

                            {postsLoading ? (
                                <RegularPostSkeleton />
                            ) : (
                                <RegularPostFeed
                                    userData={user}
                                    usersData={users}
                                    postsData={userPosts}
                                />
                            )}
                        </div>
                    </div>
                )}

                {getActiveRoute(Routes.PROFILE_ABOUT, location.pathname, { id: userCurrent?.uid }) && (
                    <Profile_About />
                )}

                {getActiveRoute(Routes.PROFILE_FRIEND, location.pathname, { id: userCurrent?.uid }) && (
                    <Profile_Friend
                        friendsData={acceptedFriends}
                    />
                )}

                {getActiveRoute(Routes.PROFILE_PHOTO, location.pathname, { id: userCurrent?.uid }) && (
                    <Profile_Photos
                        userData={userCurrent}
                        userPhotosData={userPostPhotos}
                    />
                )}

                {getActiveRoute(Routes.PROFILE_VIDEO, location.pathname, { id: userCurrent?.uid }) && (
                    <Profile_Video
                        userVideosData={userPostVideos}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;