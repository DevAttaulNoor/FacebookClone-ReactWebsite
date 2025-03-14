import { useState } from "react";
import { Link } from "react-router";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@services/firebase";
import { ReactIcons } from "@constants/ReactIcons"
import { ModalLayout } from "@layouts/ModalLayout";
import { InputField } from "../inputs/InputField";

export const FeedPost = ({ activeUser, userData, postData, postContainerStyle = 'w-full' }) => {
    const [commentInput, setCommentInput] = useState('');
    const [postModalOpen, setPostModalOpen] = useState({
        comment: null,
        reaction: null,
    })

    const handleReaction = async (postId, userId) => {
        try {
            const postDocRef = doc(db, "Posts", postId);
            const postDoc = await getDoc(postDocRef);

            if (postDoc.exists()) {
                const existingReactions = postDoc.data().reactions || [];

                if (existingReactions.includes(userId)) {
                    const updatedReactions = existingReactions.filter(id => id !== userId);
                    await updateDoc(postDocRef, { reactions: updatedReactions });
                } else {
                    const updatedReactions = [...existingReactions, userId];
                    await updateDoc(postDocRef, { reactions: updatedReactions });
                }
            } else {
                console.error("Post not found.");
            }
        } catch (error) {
            console.error("Error updating reaction:", error);
        }
    };

    const handleCommenting = async (postId, userId) => {
        try {
            const postDocRef = doc(db, "Posts", postId);
            const commentsCollectionRef = collection(postDocRef, "comments");

            await addDoc(commentsCollectionRef, {
                uid: userId,
                comment: commentInput,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            setCommentInput('')
            console.log("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <>
            {postData.map((data) => {
                const postUser = userData.find(user => user.uid === data.uid);
                const userReacted = data?.reactions?.some(reaction => reaction == activeUser?.uid)

                return (
                    <div key={data.id} className={`${postContainerStyle} flex flex-col gap-3 rounded-xl shadow-customFull2 bg-white`}>
                        <div className="flex items-center justify-between p-4 pb-0">
                            <div className="flex items-center gap-2.5">
                                {postUser?.profilePhoto ? (
                                    <img
                                        src={postUser?.profilePhoto}
                                        alt={`profile picture of ${postUser?.username}`}
                                        className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                    />
                                ) : (
                                    <span className="text-4xl">
                                        {ReactIcons.PROFILE_AVATAR}
                                    </span>
                                )}

                                <div>
                                    <Link
                                        to={`/profile/${postUser?.uid}`}
                                        className="text-sm font-medium cursor-pointer hover:underline"
                                    >
                                        {postUser?.username}
                                    </Link>

                                    <p className="text-xs text-customGray-200 cursor-pointer">{data.timestamp}</p>
                                </div>
                            </div>

                            <div className="p-2 rounded-full cursor-pointer hover:bg-customGray-100">
                                <span>{ReactIcons.OPTIONS_THREE_DOTS}</span>
                            </div>
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

                        <div className='grid grid-cols-2 mx-4 py-2 gap-1.5 border-t border-t-slate-400'>
                            <div
                                onClick={() => handleReaction(data.id, activeUser?.uid)}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-100"
                            >
                                <span className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-lg`}>{ReactIcons.LIKE_OUTLINE}</span>
                                <p className={`${userReacted ? 'text-customBlue-300' : 'text-customGray-300'} text-sm font-medium`}>Like</p>
                            </div>

                            <div
                                onClick={() => setPostModalOpen(prev => ({ ...prev, comment: data.id }))}
                                className="flex items-center justify-center p-2 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-100"
                            >
                                <span className="text-lg text-customGray-300">{ReactIcons.COMMENT}</span>
                                <p className="text-sm font-medium text-customGray-300">Comment</p>
                            </div>
                        </div>

                        {postModalOpen.reaction === data.id && (
                            <ModalLayout isOpen={true} containerStyle={'relative p-3 gap-3'}>
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

                                {data.reactions?.map((elem) => {
                                    const users = userData?.find(user => user.uid === elem);

                                    return (
                                        <div key={elem} className="flex items-center gap-2">
                                            {users?.profilePhoto ? (
                                                <img
                                                    src={users?.profilePhoto}
                                                    alt={`profile picture of ${users?.username}`}
                                                    className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                                />
                                            ) : (
                                                <span className="text-4xl">
                                                    {ReactIcons.PROFILE_AVATAR}
                                                </span>
                                            )}

                                            <Link
                                                to={`/profile/${users?.uid}`}
                                                className="text-sm font-medium cursor-pointer hover:underline"
                                            >
                                                {users?.username}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </ModalLayout>
                        )}

                        {postModalOpen.comment === data.id && (
                            <ModalLayout isOpen={true} containerStyle={'relative p-3 gap-3'}>
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

                                {data.comments?.map((elem) => {
                                    const users = userData?.find(user => user.uid === elem.uid);

                                    return (
                                        <div key={elem} className="flex gap-2">
                                            {users?.profilePhoto ? (
                                                <img
                                                    src={users?.profilePhoto}
                                                    alt={`profile picture of ${users?.username}`}
                                                    className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                                />
                                            ) : (
                                                <span className="text-4xl">
                                                    {ReactIcons.PROFILE_AVATAR}
                                                </span>
                                            )}

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

                                                <p className="text-xs ml-1 text-customGray-200 cursor-pointer">{elem.timestamp}</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="flex gap-2">
                                    {activeUser?.profilePhoto ? (
                                        <img
                                            src={activeUser?.profilePhoto}
                                            alt={`profile picture of ${activeUser?.username}`}
                                            className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                        />
                                    ) : (
                                        <span className="text-4xl">
                                            {ReactIcons.PROFILE_AVATAR}
                                        </span>
                                    )}

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
                                                onClick={() => handleCommenting(data.id, activeUser?.uid)}
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
                        )
                        }
                    </div >
                )
            })}
        </>
    )
}