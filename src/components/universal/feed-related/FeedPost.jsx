import { Link } from "react-router";
import { useEffect, useState } from "react";
import { ProfileAvatar } from '../ProfileAvatar';
import { ReactIcons } from '@constants/ReactIcons';
import { timeAgoInitials } from '@utils/TimeModule';
import { PostingModal } from '../modals/PostingModal';
import { ReactingModal } from "../modals/ReactingModal";
import { handleReacting } from "@utils/ReactionHandling";
import { CommentingModal } from "../modals/CommentingModal";
import { EntityOptionsDropdown } from "../dropdowns/EntityOptionsDropdown";

export const FeedPost = ({ postContainerStyle = 'w-full', postData, activeUser, userData, groupData, usedInGroupPosting = false }) => {
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
    const activePost = postData.find(data => data.id === modalOpen.editing);

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
        <>
            {postData?.sort((a, b) => b.timestamp - a.timestamp).map((data) => {
                const postUser = userData?.find(user => user.uid === data.uid);
                const activeGroup = groupData?.find(group => group.id === data.groupId)
                const userReacted = data?.reactions?.some(reaction => reaction.uid == activeUser?.uid)

                return (
                    <div key={data.id} className={`${postContainerStyle} flex flex-col gap-3 rounded-xl shadow-customFull2 bg-white`}>
                        <div className="relative flex items-center justify-between p-4 pb-0 z-[5]">
                            <div className={`${(usedInGroupPosting && data.groupId) ? 'gap-3.5' : 'gap-2.5'} flex items-center`}>
                                {(usedInGroupPosting && data.groupId) ? (
                                    <>
                                        {data?.isAnonymous ? (
                                            <div className="relative">
                                                <img
                                                    src={activeGroup?.coverPhoto}
                                                    alt={`cover picture of ${activeGroup?.name}`}
                                                    className='w-10 h-10 object-contain border rounded-lg border-customGray-100 bg-white'
                                                />

                                                <div className="absolute -bottom-2 -right-2">
                                                    <span className='text-2xl'>
                                                        {ReactIcons.PROFILE_AVATAR}
                                                    </span>
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
                                                        imageStyleClass="w-8 h-8"
                                                        iconStyleClass="text-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <ProfileAvatar
                                        userData={postUser}
                                        imageStyleClass="w-10 h-10"
                                        iconStyleClass="text-4xl"
                                    />
                                )}

                                <div>
                                    {(usedInGroupPosting && data.groupId) ? (
                                        <>
                                            <Link
                                                to={`/group/${activeGroup?.id}`}
                                                className="text-sm font-medium cursor-pointer hover:underline"
                                            >
                                                {activeGroup?.name}
                                            </Link>

                                            <div className="flex items-center gap-1">
                                                {data?.isAnonymous ? (
                                                    <p className="text-xs font-medium cursor-pointer text-customGray-200 hover:underline">
                                                        Anonymous participant
                                                    </p>
                                                ) : (
                                                    <Link
                                                        to={`/profile/${postUser?.uid}`}
                                                        className="text-xs font-medium cursor-pointer text-customGray-200 hover:underline"
                                                    >
                                                        {postUser?.username}
                                                    </Link>
                                                )}

                                                <p className="text-xs text-customGray-200 cursor-pointer"> · {timeAgoInitials(data.timestamp)}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to={`/profile/${postUser?.uid}`}
                                                className="text-sm font-medium cursor-pointer hover:underline"
                                            >
                                                {postUser?.username}
                                            </Link>

                                            <p className="text-xs text-customGray-200 cursor-pointer">{timeAgoInitials(data.timestamp)}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <span
                                onClick={() => setPostActionDropdown(data.id)}
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
                                entityData={data}
                                userData={activeUser}
                            />
                        </div>

                        <div className="flex flex-col px-4 gap-3">
                            {data.message && (
                                <p>{data.message}</p>
                            )}

                            {data.mediaType === 'image' && (
                                <img
                                    src={data.media}
                                    alt={`image of ${data.media}`}
                                    className="max-h-[420px] w-full h-full object-contain bg-customGray-default"
                                />
                            )}

                            {data.mediaType === 'video' && (
                                <video controls className="max-h-[420px] w-full h-full object-contain bg-customGray-default">
                                    <source src={data.media} type="video/mp4" />
                                </video>
                            )}
                        </div>

                        {(data.reactions?.length > 0 || data.comments?.length > 0) && (
                            <div className="flex items-center justify-between px-4">
                                {data.reactions?.length > 0 && (
                                    <p
                                        onClick={() => setModalOpen(prev => ({ ...prev, reaction: data.id }))}
                                        className="text-sm cursor-pointer text-customGray-200 hover:underline"
                                    >
                                        {data.reactions?.length} {data.reactions?.length > 1 ? 'reactions' : 'reaction'}
                                    </p>
                                )}

                                {data.comments?.length > 0 && (
                                    <p
                                        onClick={() => setModalOpen(prev => ({ ...prev, comment: data.id }))}
                                        className="text-sm cursor-pointer text-customGray-200 hover:underline"
                                    >
                                        {data.comments?.length} {data.comments?.length > 1 ? 'comments' : 'comment'}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className='grid grid-cols-2 mx-4 py-2 gap-1.5 border-t border-t-slate-400'>
                            <button
                                onClick={() => handleReacting('Posts', data, activeUser?.uid)}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                <span className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-lg`}>{ReactIcons.LIKE_OUTLINE}</span>
                                <p className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-sm font-medium`}>Like</p>
                            </button>

                            <button
                                onClick={() => setModalOpen(prev => ({ ...prev, comment: data.id }))}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                <span className="text-lg text-customGray-300">{ReactIcons.COMMENT}</span>
                                <p className="text-sm font-medium text-customGray-300">Comment</p>
                            </button>
                        </div>

                        {modalOpen.editing === data.id && (
                            <PostingModal
                                editingStatus={true}
                                userData={activeUser}
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

                        {modalOpen.comment === data.id && (
                            <CommentingModal
                                modalStateData={{
                                    modalOpen: modalOpen,
                                    setModalOpen: setModalOpen
                                }}
                                entity={'Posts'}
                                enityData={data}
                                userData={activeUser}
                                usersData={userData}
                            />
                        )}

                        {modalOpen.reaction === data.id && (
                            <ReactingModal
                                modalStateData={{
                                    modalOpen: modalOpen,
                                    setModalOpen: setModalOpen
                                }}
                                entityData={data}
                                usersData={userData}
                            />
                        )}
                    </div>
                )
            })}
        </>
    )
}