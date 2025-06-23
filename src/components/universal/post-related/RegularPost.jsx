import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Routes } from "@constants/Routes";
import { ProfileAvatar } from "../ProfileAvatar";
import { ReactIcons } from "@constants/ReactIcons";
import { generatePath } from "@utils/PathResolver";
import { timeAgoInitials } from "@utils/TimeModule";
import { PostingModal } from "../modals/PostingModal";
import { ReactingModal } from "../modals/ReactingModal";
import { handleReacting } from "@utils/ReactionHandling";
import { CommentingModal } from "../modals/CommentingModal";
import { EntityOptionsDropdown } from "../dropdowns/EntityOptionsDropdown";

export const RegularPost = ({
    userData,
    usersData,
    postData,
    postsData,
    groupData,
    usedInGroupPosting,
    postContainerStyle,
}) => {
    const [message, setMessage] = useState({
        text: '',
        media: '',
        mediaType: ''
    });
    const [modalOpen, setModalOpen] = useState({
        emoji: false,
        editing: null,
        comment: null,
        reaction: null,
    });
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [postActionDropdown, setPostActionDropdown] = useState(null);
    const postUser = usersData?.find(user => user.uid === postData?.uid);
    const activePost = postsData.find(post => post.id === modalOpen.editing);
    const activeGroup = groupData?.find(group => group.id === postData?.groupId)
    const userReacted = postData?.reactions?.some(reaction => reaction.uid == userData?.uid)

    useEffect(() => {
        if (activePost) {
            setMessage(prev => ({
                ...prev,
                text: activePost.message || "",
                media: activePost.media || "",
                mediaType: activePost.mediaType || "",
            }))
            setIsAnonymous(activePost?.isAnonymous || false)
        }
    }, [activePost]);

    return (
        <div className={`${postContainerStyle} flex flex-col gap-3 rounded-xl shadow-customFull2 bg-white`}>
            <div className="relative flex items-center justify-between p-4 pb-0 z-[5]">
                <div className={`${(usedInGroupPosting && postData?.groupId) ? 'gap-3.5' : 'gap-2.5'} flex items-center`}>
                    {(usedInGroupPosting && postData?.groupId) ? (
                        <>
                            {postData?.isAnonymous ? (
                                <div className="relative">
                                    <img
                                        src={activeGroup?.coverPhoto}
                                        alt={`cover picture of ${activeGroup?.name}`}
                                        className='w-10 h-10 object-contain border rounded-lg border-customGray-100 bg-white'
                                    />

                                    <div className="absolute -bottom-2 -right-2 text-[16px] p-1 border rounded-full border-customGray-100 text-customGray-300 bg-white">
                                        {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={activeGroup?.coverPhoto}
                                        alt={`cover picture of ${activeGroup?.name}`}
                                        className='w-10 h-10 object-contain border rounded-lg border-customGray-100 bg-white'
                                    />

                                    <div className="absolute -bottom-2 -right-2">
                                        <ProfileAvatar
                                            userData={postUser}
                                            imageStyleClass="w-7 h-7"
                                            iconStyleClass="text-[26px]"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <ProfileAvatar
                            userData={postUser}
                            imageStyleClass="w-[42px] h-[42px]"
                            iconStyleClass="text-[42px]"
                        />
                    )}

                    <div>
                        {(usedInGroupPosting && postData?.groupId) ? (
                            <>
                                <Link
                                    to={generatePath({ path: Routes.GROUP.path }, { id: activeGroup?.id })}
                                    className="text-sm font-medium cursor-pointer hover:underline"
                                >
                                    {activeGroup?.name}
                                </Link>

                                <div className="flex items-center gap-1">
                                    {postData?.isAnonymous ? (
                                        <p className="text-xs font-medium cursor-pointer text-customGray-200 hover:underline">
                                            Anonymous participant
                                        </p>
                                    ) : (
                                        <Link
                                            to={generatePath({ path: Routes.PROFILE.path }, { id: postUser?.uid })}
                                            className="text-xs font-medium cursor-pointer text-customGray-200 hover:underline"
                                        >
                                            {postUser?.username}
                                        </Link>
                                    )}

                                    <p className="text-xs text-customGray-200 cursor-pointer"> · {timeAgoInitials(postData?.timestamp)}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={generatePath({ path: Routes.PROFILE.path }, { id: postUser?.uid })}
                                    className="text-sm font-medium cursor-pointer hover:underline"
                                >
                                    {postUser?.username}
                                </Link>

                                <p className="text-xs text-customGray-200 cursor-pointer">{timeAgoInitials(postData?.timestamp)}</p>
                            </>
                        )}
                    </div>
                </div>

                <span
                    onClick={() => setPostActionDropdown(postData?.id)}
                    className="p-2 rounded-full cursor-pointer hover:bg-customGray-default"
                >
                    {ReactIcons.OPTIONS_THREE_DOTS}
                </span>

                <EntityOptionsDropdown
                    dropdownStateData={{
                        dropdownOpen: postActionDropdown,
                        setDropdownOpen: setPostActionDropdown
                    }}
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    entity={'Posts'}
                    userData={userData}
                    entityData={postData}
                />
            </div>

            <div className="flex flex-col px-4 gap-3">
                {postData?.message && (
                    <p>{postData?.message}</p>
                )}

                {postData?.mediaType === 'image' && (
                    <img
                        src={postData?.media}
                        alt={`image of ${postData?.media}`}
                        className="max-h-[420px] w-full h-full object-contain bg-customGray-default"
                    />
                )}

                {postData?.mediaType === 'video' && (
                    <video controls className="max-h-[420px] w-full h-full object-contain bg-customGray-default">
                        <source src={postData?.media} type="video/mp4" />
                    </video>
                )}
            </div>

            {(postData?.reactions?.length > 0 || postData?.comments?.length > 0) && (
                <div className="flex items-center justify-between px-4">
                    {postData?.reactions?.length > 0 && (
                        <p
                            onClick={() => setModalOpen(prev => ({ ...prev, reaction: postData?.id }))}
                            className="text-sm cursor-pointer text-customGray-200 hover:underline"
                        >
                            {postData?.reactions?.length} {postData?.reactions?.length > 1 ? 'reactions' : 'reaction'}
                        </p>
                    )}

                    {postData?.comments?.length > 0 && (
                        <p
                            onClick={() => setModalOpen(prev => ({ ...prev, comment: postData?.id }))}
                            className="text-sm cursor-pointer text-customGray-200 hover:underline"
                        >
                            {postData?.comments?.length} {postData?.comments?.length > 1 ? 'comments' : 'comment'}
                        </p>
                    )}
                </div>
            )}

            <div className='grid grid-cols-2 mx-4 py-2 gap-1.5 border-t border-t-slate-400'>
                <button
                    onClick={() => handleReacting('Posts', postData, userData?.uid)}
                    className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                >
                    <span className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-lg`}>{ReactIcons.LIKE_OUTLINE}</span>
                    <p className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-sm font-medium`}>Like</p>
                </button>

                <button
                    onClick={() => setModalOpen(prev => ({ ...prev, comment: postData?.id }))}
                    className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                >
                    <span className="text-lg text-customGray-300">{ReactIcons.COMMENT}</span>
                    <p className="text-sm font-medium text-customGray-300">Comment</p>
                </button>
            </div>

            {modalOpen.editing === postData?.id && (
                <PostingModal
                    editingStatus={true}
                    userData={userData}
                    postData={activePost}
                    groupData={groupData}
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    messageStateData={{
                        message: message,
                        setMessage: setMessage
                    }}
                    anonymousStateData={{
                        isAnonymous: isAnonymous,
                        setIsAnonymous: setIsAnonymous
                    }}
                    usedInGroupPosting={usedInGroupPosting}
                />
            )}

            {modalOpen.comment === postData?.id && (
                <CommentingModal
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    entity={'Posts'}
                    enityData={postData}
                    userData={userData}
                    usersData={usersData}
                />
            )}

            {modalOpen.reaction === postData?.id && (
                <ReactingModal
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    entityData={postData}
                    usersData={usersData}
                />
            )}
        </div>
    )
}
