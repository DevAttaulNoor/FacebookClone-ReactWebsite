import { useRef } from "react";
import { Link, NavLink, useParams } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Routes } from "@constants/Routes";
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@services/firebase";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { useUsers } from "@hooks/useUsers";
import { generatePath } from "@utils/PathResolver";

export const EntityInformationSection = ({ location, entityType, entityData, componentsData }) => {
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers()
    const coverPhotoRef = useRef(null);
    const profilePhotoRef = useRef(null);
    const entityId = entityType === 'profile'
        ? entityData.activeEntityData?.uid
        : entityData.activeEntityData?.adminId;

    const handleGroupRelatedPhotoChange = async (photoTypeRef, groupId) => {
        const file = photoTypeRef.current.files[0];
        if (file) {
            try {
                let photo;
                const storageRef = ref(storage, `Groups/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                photo = await getDownloadURL(storageRef);

                const groupDocRef = doc(db, "Groups", groupId);
                await updateDoc(groupDocRef, { coverPhoto: photo });
                console.log(`Success uploading coverPhoto`);
            } catch (error) {
                console.error(`Error uploading coverPhoto:`, error);
            }
        }
    };

    const handleProfileRelatedPhotoChange = async (photoType, photoTypeRef) => {
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
        <section className="w-full flex flex-col items-center px-4 shadow bg-white">
            {/* Entity Cover Photo Section */}
            <div
                style={{ backgroundImage: `url(${entityData.activeEntityData?.coverPhoto})` }}
                className="bg-cover bg-center bg-no-repeat h-[200px] max-w-[1080px] w-full flex items-end justify-end p-1.5 rounded-b-lg bg-customGray-default xs:h-[240px] xs:p-2 sm:h-[280px] sm:p-2.5 md:h-[320px] md:p-3 lg:h-[360px] lg:p-3.5 xl:h-[400px] xl:p-4 2xl:h-[450px]"
            >
                {entityId === user?.uid && (
                    <>
                        <BasicButton
                            btnStyleClass="!w-fit z-[5] bg-white hover:bg-slate-50"
                            btnData={{
                                text: entityData.activeEntityData?.coverPhoto
                                    ? (entityType === 'profile' ? 'Edit cover photo' : 'Edit')
                                    : (entityType === 'profile' ? 'Add cover photo' : 'Add'),
                                icon: entityData.activeEntityData?.coverPhoto
                                    ? ReactIcons.EDIT_PENCIL
                                    : ReactIcons.ADD_PLUS,
                                onClick: () => coverPhotoRef.current.click(),
                            }}
                        />
                        <input
                            ref={coverPhotoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={entityData === 'profile' ? () => handleProfileRelatedPhotoChange('coverPhoto', coverPhotoRef) : () => handleGroupRelatedPhotoChange('coverPhoto', coverPhotoRef)}
                        />
                    </>
                )}
            </div>

            {/* Entity Profile Section */}
            <div className="max-w-[1040px] w-full p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4">
                {entityType === 'profile' && (
                    <div className="w-full flex items-end justify-between -mt-10 md:-mt-14 lg:-mt-16 xl:-mt-[72px]">
                        <div className="flex flex-col items-center gap-1.5 xs:flex-row xs:items-end xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4">
                            <div className="relative">
                                <img
                                    src={entityData.activeEntityData?.profilePhoto}
                                    alt={`profile image of ${entityData.activeEntityData?.username}`}
                                    className="w-24 h-24 rounded-full border-4 border-white object-cover xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44"
                                />

                                {entityData.activeEntityData?.uid == user?.uid && (
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

                            <div className={`${entityData.activeEntityFriends?.length > 0 ? 'mb-0 sm:mb-1 xl:mb-2' : 'mb-14'} flex flex-col`}>
                                <h3 className="text-lg font-bold xs:text-xl sm:text-2xl lg:text-3xl">{entityData.activeEntityData?.username}</h3>

                                {entityData.activeEntityFriends?.length > 0 && (
                                    <Link to={Routes.FRIEND_AllFRIENDS.path} className="w-fit text-xs md:text-sm text-customGray-200 cursor-pointer hover:underline">
                                        {`${entityData.activeEntityFriends?.length} ${entityData.activeEntityFriends?.length > 1 ? 'friends' : 'friend'}`}
                                    </Link>
                                )}

                                <div className="flex items-center mt-1">
                                    {entityData.activeEntityFriends?.slice(0, 8).map((data) => (
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
                            {entityData.activeEntityData?.uid == user?.uid ? (
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
                                    {entityData.activeEntityFriends?.some(data => data.uid == user?.uid) ? (
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
                )}

                {entityType === 'group' && (
                    <div className="w-full flex items-end justify-between">
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold sm:text-2xl lg:text-3xl">{entityData.activeEntityData?.name}</h3>

                            <Link
                                to={generatePath({ path: Routes.GROUP_PEOPLE.path }, { id: id })}
                                className="w-fit text-xs md:text-sm text-customGray-200 cursor-pointer hover:underline"
                            >
                                {`${entityData.activeEntityData?.members?.length} ${entityData.activeEntityData?.members?.length > 1 ? 'members' : 'member'}`}
                            </Link>

                            <div className="flex items-center mt-1">
                                {entityData.activeEntityData?.members?.slice(0, 8).map((data) => {
                                    const memberData = users?.find(member => data.includes(member.id))

                                    return (
                                        <Link
                                            key={data}
                                            to={`/profile/${data}`}
                                            className="rounded-full border-2 border-white -mr-2 last:-mr-0"
                                        >
                                            <ProfileAvatar
                                                userData={memberData}
                                                imageStyleClass="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9"
                                                iconStyleClass="text-3xl"
                                            />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {entityData.activeEntityRelatedData ? (
                                <BasicButton
                                    btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                    btnData={{
                                        text: 'Joined',
                                        icon: ReactIcons.GROUP,
                                    }}
                                />
                            ) : (
                                <BasicButton
                                    btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                    btnData={{
                                        text: 'Leave',
                                        icon: ReactIcons.GROUP,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Entity Components Navigation Section */}
            <div className="max-w-[1040px] w-full flex gap-1 px-1.5 border-t border-slate-400 xs:px-2 sm:px-2.5 md:px-3 lg:px-3.5 xl:px-4">
                {componentsData.map(({ id, title, path }) => (
                    <NavLink
                        end
                        key={id}
                        to={path}
                        className={({ isActive }) => {
                            const isActuallyActive = isActive || (id === 1 && location.pathname === `/profile/${entityData.activeEntityData?.uid}`);
                            return `${isActuallyActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-xs font-semibold p-2 my-1 rounded-lg cursor-pointer xs:p-2.5 sm:p-3 md:text-sm lg:p-3.5 2xl:p-4`;
                        }}
                    >
                        {title}
                    </NavLink>
                ))}
            </div>
        </section>
    )
}