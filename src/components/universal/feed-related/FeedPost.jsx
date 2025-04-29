import '@assets/css/customEmojiPickerStyle.css'
import EmojiPicker from 'emoji-picker-react';
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { SvgIcons } from '@constants/SvgIcons';
import { db, storage } from '@services/firebase';
import { ProfileAvatar } from '../ProfileAvatar';
import { InputField } from '../inputs/InputField';
import { ReactIcons } from '@constants/ReactIcons';
import { ModalLayout } from '@layouts/ModalLayout';
import { timeAgoInitials } from '@utils/TimeModule';
import { BasicButton } from '../buttons/BasicButton';
import { TextareaField } from '../inputs/TextareaField';
import { handleMediaChange } from '@utils/MediaHandling';
import { BasicDropdown } from '../dropdowns/BasicDropdown';

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

export const FeedPost = ({ activeUser, userData, postData, postContainerStyle = 'w-full', groupData, usedInGroupPosting = false }) => {
    const messageMediaRef = useRef(null);
    const [message, setMessage] = useState({
        text: '',
        media: '',
        mediaType: ''
    });
    const [postModalOpen, setPostModalOpen] = useState({
        emoji: false,
        editing: null,
        comment: null,
        reaction: null,
    });
    const [commentInput, setCommentInput] = useState('');
    const [postActionDropdown, setPostActionDropdown] = useState(null);
    const activePost = postData.find(data => data.id === postModalOpen.editing);

    const handleReaction = async (postId, postUid, userId) => {
        try {
            const postDocRef = doc(db, "Posts", postId);
            const postDoc = await getDoc(postDocRef);

            const userDocRef = doc(db, "Users", postUid);
            const userDoc = await getDoc(userDocRef);

            if (postDoc.exists()) {
                let existingReactions = postDoc.data().reactions || [];

                if (existingReactions.some(reaction => reaction.uid === userId)) {
                    // Remove user reaction
                    existingReactions = existingReactions.filter(reaction => reaction.uid !== userId);
                } else {
                    // Add user reaction with timestamp
                    existingReactions.push({
                        uid: userId,
                        timestamp: Math.floor(Date.now() / 1000),
                    });
                }

                await updateDoc(postDocRef, { reactions: existingReactions });
            } else {
                console.error("Post not found.");
                return;
            }

            if (userDoc.exists()) {
                let existingNotifications = userDoc.data().notifications || [];

                if (existingNotifications.some(reaction => reaction.uid === userId)) {
                    // Remove user reaction
                    existingNotifications = existingNotifications.filter(notification => notification.uid !== userId);
                } else {
                    // Add user reaction with timestamp
                    existingNotifications.push({
                        uid: userId,
                        postId: postId,
                        status: 'reacted',
                        timestamp: Math.floor(Date.now() / 1000),
                    });
                }

                await updateDoc(userDocRef, { notifications: existingNotifications });
            } else {
                console.error("User not found.");
            }

            console.log("Reaction updated successfully!");
        } catch (error) {
            console.error("Error updating reaction:", error);
        }
    };

    const handleCommenting = async (postId, postUid, userId) => {
        try {
            await addDoc(collection(doc(db, "Posts", postId), "comments"), {
                uid: userId,
                comment: commentInput,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            const userDocRef = doc(db, "Users", postUid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                let existingNotifications = userDoc.data().notifications || [];

                existingNotifications.push({
                    uid: userId,
                    postId: postId,
                    status: 'commented',
                    comment: commentInput,
                    timestamp: Math.floor(Date.now() / 1000),
                });

                await updateDoc(userDocRef, { notifications: existingNotifications });
            } else {
                console.error("User not found.");
            }

            setCommentInput('')
            console.log("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handlePostDelete = async (postId) => {
        try {
            await deleteDoc(doc(db, 'Posts', postId));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handlePostSave = async (postId, userId) => {
        try {
            const postDocRef = doc(db, "Posts", postId);
            const postDoc = await getDoc(postDocRef);

            if (postDoc.exists()) {
                const existingSaves = postDoc.data().saves || [];
                const userIndex = existingSaves.findIndex(entry => entry.uid === userId);

                if (userIndex !== -1) {
                    const updatedSaves = existingSaves.filter(entry => entry.uid !== userId);
                    await updateDoc(postDocRef, { saves: updatedSaves });
                } else {
                    const updatedSaves = [...existingSaves, { uid: userId, timestamp: Math.floor(Date.now() / 1000) }];
                    await updateDoc(postDocRef, { saves: updatedSaves });
                }
            } else {
                console.error("Post not found.");
            }
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const handlePostEdit = async (postId, userId) => {
        try {
            const postRef = doc(db, "Posts", postId);

            if ((message.text !== '') && (message.media === '')) {
                await updateDoc(postRef, {
                    message: message.text,
                    media: '',
                    mediaType: '',
                });

                setPostModalOpen(prev => ({ ...prev, editing: null }));
                return;
            }

            if ((message.text === '') && (message.media !== '')) {
                const file = message.media;
                const storageRef = ref(storage, `Posts/${userId}/${file.name}`);
                await uploadBytes(storageRef, file);
                let mediaUrl = await getDownloadURL(storageRef);

                await updateDoc(postRef, {
                    message: '',
                    media: mediaUrl,
                    mediaType: message.mediaType,
                });

                setPostModalOpen(prev => ({ ...prev, editing: null }));
            }

            if ((message.text !== '') && (message.media !== '')) {
                const file = message.media;
                const storageRef = ref(storage, `Posts/${userId}/${file.name}`);
                await uploadBytes(storageRef, file);
                let mediaUrl = await getDownloadURL(storageRef);

                await updateDoc(postRef, {
                    message: message.text,
                    media: mediaUrl,
                    mediaType: message.mediaType,
                });

                setPostModalOpen(prev => ({ ...prev, editing: null }));
            }
        } catch (error) {
            console.error("Error editing post: ", error);
        }
    };

    useEffect(() => {
        if (activePost) {
            setMessage(prev => ({
                ...prev,
                text: activePost.message || "",
                media: activePost.media || "",
                mediaType: activePost.mediaType || "",
            }))
        }
    }, [activePost]);

    return (
        <>
            {postData?.sort((a, b) => b.timestamp - a.timestamp).map((data) => {
                const postUser = userData?.find(user => user.uid === data.uid);
                const activeGroup = groupData?.find(group => group.id === data.groupId)
                const userReacted = data?.reactions?.some(reaction => reaction.uid == activeUser?.uid)

                console.log(data.groupId)

                return (
                    <div key={data.id} className={`${postContainerStyle} flex flex-col gap-3 rounded-xl shadow-customFull2 bg-white`}>
                        <div className="relative flex items-center justify-between p-4 pb-0 z-[5]">
                            <div className={`${(usedInGroupPosting && data.groupId) ? 'gap-3.5' : 'gap-2.5'} flex items-center`}>
                                {(usedInGroupPosting && data.groupId) ? (
                                    <>
                                        {data?.isAnonymous ? (
                                            <div className="relative">
                                                <img
                                                    src={data?.coverPhoto}
                                                    alt={`cover picture of ${data?.name}`}
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
                                                    src={data?.coverPhoto}
                                                    alt={`cover picture of ${data?.name}`}
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
                                                to={`/group/${activeGroup?.groupId}`}
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

                            <BasicDropdown
                                isOpen={postActionDropdown === data.id}
                                isClose={() => setPostActionDropdown(null)}
                                dropdownContainerStyle="dropdownContainerStyle1 p-2 gap-1.5 top-14 right-6 shadow-customFull2"
                            >
                                {data.uid === activeUser?.uid ? (
                                    <>
                                        <div
                                            onClick={() => setPostModalOpen(prev => ({ ...prev, editing: data.id }))}
                                            className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                                        >
                                            <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>

                                            <div className="flex flex-col gap-0.5">
                                                <h5 className="text-sm font-medium">Edit post</h5>
                                                <p className="text-xs text-customGray-200">Edit your post as require</p>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => handlePostDelete(data.id)}
                                            className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                                        >
                                            <span className="text-lg">{ReactIcons.DELETE_TRASHBIN}</span>

                                            <div className="flex flex-col gap-0.5">
                                                <h5 className="text-sm font-medium">Move to trash</h5>
                                                <p className="text-xs text-customGray-200">Items in your trash are deleted</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        onClick={() => handlePostSave(data.id, activeUser?.uid)}
                                        className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                                    >
                                        <span>{SvgIcons.SAVED({ styleClass: 'w-[18px] h-[18px]' })}</span>

                                        <div className="flex flex-col gap-0.5">
                                            <h5 className="text-sm font-medium">{data.saves?.find(elem => elem.uid === activeUser?.uid) ? 'Unsave post' : 'Save post'}</h5>
                                            <p className="text-xs text-customGray-200">Add this to your saved items</p>
                                        </div>
                                    </div>
                                )}
                            </BasicDropdown>
                        </div>

                        <div className="flex flex-col px-4 gap-3">
                            {data.message && (
                                <p>{data.message}</p>
                            )}

                            {data.mediaType === 'image' && (
                                <img
                                    src={data.media}
                                    alt={`image of ${data.media}`}
                                    className="max-h-[500px] w-full h-full object-contain bg-customGray-default"
                                />
                            )}

                            {data.mediaType === 'video' && (
                                <video controls className="max-h-[500px] w-full h-full object-contain bg-customGray-default">
                                    <source src={data.media} type="video/mp4" />
                                </video>
                            )}
                        </div>

                        {(data.reactions?.length > 0 || data.comments?.length > 0) && (
                            <div className="flex items-center justify-between px-4">
                                {data.reactions?.length > 0 && (
                                    <p
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, reaction: data.id }))}
                                        className="text-sm cursor-pointer text-customGray-200 hover:underline"
                                    >
                                        {data.reactions?.length} {data.reactions?.length > 1 ? 'reactions' : 'reaction'}
                                    </p>
                                )}

                                {data.comments?.length > 0 && (
                                    <p
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, comment: data.id }))}
                                        className="text-sm cursor-pointer text-customGray-200 hover:underline"
                                    >
                                        {data.comments?.length} {data.comments?.length > 1 ? 'comments' : 'comment'}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className='grid grid-cols-2 mx-4 py-2 gap-1.5 border-t border-t-slate-400'>
                            <button
                                onClick={() => handleReaction(data.id, data.uid, activeUser?.uid)}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                <span className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-lg`}>{ReactIcons.LIKE_OUTLINE}</span>
                                <p className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-sm font-medium`}>Like</p>
                            </button>

                            <button
                                onClick={() => setPostModalOpen(prev => ({ ...prev, comment: data.id }))}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-default"
                            >
                                <span className="text-lg text-customGray-300">{ReactIcons.COMMENT}</span>
                                <p className="text-sm font-medium text-customGray-300">Comment</p>
                            </button>
                        </div>

                        {postModalOpen.editing === data.id && (
                            <ModalLayout isOpen={true} containerStyle={'relative p-3 gap-3'}>
                                <div className="flex justify-center">
                                    <h1 className="text-lg font-bold">Edit post</h1>

                                    <span
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, editing: null }))}
                                        className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                                    >
                                        {ReactIcons.CLOSE}
                                    </span>
                                </div>

                                <hr className="text-customGray-default" />

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <ProfileAvatar
                                            userData={postUser}
                                            imageStyleClass="w-10 h-10"
                                            iconStyleClass="text-4xl"
                                        />


                                        <p className="text-sm font-semibold">{postUser?.username}</p>
                                    </div>

                                    <TextareaField
                                        textareaData={{
                                            rows: 4,
                                            value: message.text,
                                            placeholder: "What's on your mind",
                                            onChange: (e) => setMessage(prev => ({ ...prev, text: e.target.value })),
                                        }}
                                        textareaStyle={`${message.media ? 'text-sm' : 'text-xl'} w-full resize-none`}
                                    />

                                    {message.media && (
                                        <div className='relative rounded-lg border border-customGray-default'>
                                            {message.mediaType === 'image' && (
                                                <img src={message.media} className="w-full h-56 p-1 rounded-lg object-contain" />
                                            )}

                                            {message.mediaType === 'video' && (
                                                <video controls className="w-full h-56 p-1 rounded-lg object-contain">
                                                    <source src={message.media} type="video/mp4" />
                                                </video>
                                            )}

                                            <span
                                                onClick={() => setMessage(prev => ({ ...prev, media: '', mediaType: '' }))}
                                                className="absolute top-2 right-2 cursor-pointer"
                                            >
                                                {ReactIcons.CLOSE}
                                            </span>
                                        </div>
                                    )}

                                    <span
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, emoji: !prev.emoji }))}
                                        className="self-end text-xl text-customGray-200 cursor-pointer hover:text-customGray-300"
                                    >
                                        {ReactIcons.SMILE_EMOJI}
                                    </span>

                                    {postModalOpen.emoji && (
                                        <EmojiPicker
                                            onEmojiClick={(e) => setMessage(prev => ({ ...prev, text: prev.text + e.emoji }))}
                                            className='customStyle'
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col px-3 gap-2 border rounded-lg border-customGray-default p-2.5">
                                    <p className="text-sm font-semibold">Add to your post</p>

                                    <div className="flex items-center gap-4">
                                        {feedPostingOptions.map((data) => (
                                            <img
                                                key={data.id}
                                                src={data.icon}
                                                alt={`icon of ${data.title}`}
                                                onClick={() => messageMediaRef.current.click()}
                                                className="cursor-pointer"
                                            />
                                        ))}
                                        <input
                                            ref={messageMediaRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => handleMediaChange(e, setMessage)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <BasicButton
                                    btnStyleClass={`${(message.text || message.media) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'}`}
                                    btnData={{
                                        text: 'Save',
                                        onClick: () => handlePostEdit(data.id, activeUser?.uid),
                                    }}
                                />
                            </ModalLayout>
                        )}

                        {postModalOpen.comment === data.id && (
                            <ModalLayout isOpen={true} containerStyle={'relative max-h-96 p-3 gap-3'}>
                                <div className="flex justify-center">
                                    <h1 className="text-lg font-bold">Comments</h1>

                                    <span
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, comment: null }))}
                                        className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                                    >
                                        {ReactIcons.CLOSE}
                                    </span>
                                </div>

                                <hr className="text-customGray-default" />

                                <div className='flex flex-col gap-3 overflow-y-auto'>
                                    {data.comments.sort((a, b) => a.timestamp - b.timestamp)?.map((elem) => {
                                        const users = userData?.find(user => user.uid === elem.uid);

                                        return (
                                            <div key={elem.id} className="flex gap-2">
                                                <ProfileAvatar
                                                    userData={users}
                                                    imageStyleClass="w-10 h-10"
                                                    iconStyleClass="text-4xl"
                                                />

                                                <div className="flex flex-col">
                                                    <div className="px-3 py-1.5 rounded-2xl bg-customGray-default">
                                                        <Link
                                                            to={`/profile/${users?.uid}`}
                                                            className="text-sm font-medium cursor-pointer hover:underline"
                                                        >
                                                            {users?.username}
                                                        </Link>

                                                        <p className="text-sm">{elem.comment}</p>
                                                    </div>

                                                    <p className="text-xs ml-1 text-customGray-200 cursor-pointer">{timeAgoInitials(elem.timestamp)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-2">
                                    <ProfileAvatar
                                        userData={activeUser}
                                        imageStyleClass="w-10 h-10"
                                        iconStyleClass="text-4xl"
                                    />

                                    <div className="w-full flex items-center px-3 py-2.5 gap-1.5 rounded-xl bg-customGray-default">
                                        <InputField
                                            inputData={{
                                                type: 'text',
                                                value: commentInput,
                                                placeholder: 'Write a comment...',
                                                onChange: (e) => setCommentInput(e.target.value),
                                            }}
                                            inputStyle="w-full text-sm bg-transparent"
                                        />

                                        {commentInput ? (
                                            <button
                                                onClick={() => handleCommenting(data.id, data.uid, activeUser?.uid)}
                                                className='cursor-pointer text-customBlue-300'
                                            >
                                                {ReactIcons.SEND_ARROW}
                                            </button>
                                        ) : (
                                            <span className='cursor-not-allowed text-customGray-200'>
                                                {ReactIcons.SEND_ARROW}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </ModalLayout>
                        )}

                        {postModalOpen.reaction === data.id && (
                            <ModalLayout isOpen={true} containerStyle={'relative max-h-96 p-3 gap-3'}>
                                <div className="flex justify-center">
                                    <h1 className="text-lg font-bold">Reactions</h1>

                                    <span
                                        onClick={() => setPostModalOpen(prev => ({ ...prev, reaction: null }))}
                                        className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                                    >
                                        {ReactIcons.CLOSE}
                                    </span>
                                </div>

                                <hr className="text-customGray-default" />

                                <div className='flex flex-col gap-3 overflow-y-auto'>
                                    {data.reactions?.map((elem) => {
                                        const users = userData?.find(user => user.uid === elem.uid);

                                        return (
                                            <div key={elem} className="flex items-center gap-2">
                                                <ProfileAvatar
                                                    userData={users}
                                                    imageStyleClass="w-10 h-10"
                                                    iconStyleClass="text-4xl"
                                                />

                                                <Link
                                                    to={`/profile/${users?.uid}`}
                                                    className="text-sm font-medium cursor-pointer hover:underline"
                                                >
                                                    {users?.username}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ModalLayout>
                        )}
                    </div>
                )
            })}
        </>
    )
}