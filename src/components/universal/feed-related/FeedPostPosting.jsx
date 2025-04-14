import '@assets/css/customEmojiPickerStyle.css'
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from "react";
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@contexts/AuthContext';
import { db, storage } from '@services/firebase';
import { ProfileAvatar } from '../ProfileAvatar';
import { ReactIcons } from '@constants/ReactIcons';
import { ModalLayout } from '@layouts/ModalLayout';
import { TextareaField } from '../inputs/TextareaField';
import { ToggleButton } from '../buttons/ToggleButton';

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

export const FeedPostPosting = ({ usedInGroupPosting = false, groupData }) => {
    const { user } = useAuth();
    const emojiBoxRef = useRef(null);
    const messageMediaInputRef = useRef(null);
    const [messageText, setMessageText] = useState('');
    const [messageMedia, setMessageMedia] = useState({ content: '', type: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [isAnonymous, setIsAnonymously] = useState(false);

    const handleModalClose = () => {
        setModalOpen(false);
        setIsEmojiModalOpen(false);
        setMessageText('');
        setMessageMedia({ content: '', type: '' });
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setMessageMedia(prev => ({ ...prev, content: file }));

            // Determine the media type (image or video)
            if (file.type.startsWith("image/")) {
                setMessageMedia(prev => ({ ...prev, type: "image" }));
            } else if (file.type.startsWith("video/")) {
                setMessageMedia(prev => ({ ...prev, type: "video" }));
            }
        }
    };

    const handlePosting = async (e) => {
        e.preventDefault();

        const postDetails = {
            uid: user.uid,
            email: user.email,
            timestamp: Math.floor(new Date().getTime() / 1000),
            ...(usedInGroupPosting ? { groupId: groupData.id, isAnonymous } : {})
        };

        try {
            setPostLoading(true)
            const postRef = doc(collection(db, "Posts"));

            if ((messageText !== '') && (messageMedia.content === '')) {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageText,
                });

                handleModalClose();
                setPostLoading(false)
                return;
            }

            if ((messageText === '') && (messageMedia.content !== '')) {
                const file = messageMedia.content;
                const storageRef = ref(storage, `Posts/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                let mediaUrl = await getDownloadURL(storageRef);

                await setDoc(postRef, {
                    ...postDetails,
                    media: mediaUrl,
                    mediaType: messageMedia.type,
                });

                setPostLoading(false)
                handleModalClose();
            }

            if ((messageText !== '') && (messageMedia.content !== '')) {
                const file = messageMedia.content;
                const storageRef = ref(storage, `Posts/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                let mediaUrl = await getDownloadURL(storageRef);

                await setDoc(postRef, {
                    ...postDetails,
                    message: messageText,
                    media: mediaUrl,
                    mediaType: messageMedia.type,
                });

                setPostLoading(false)
                handleModalClose();
            }
        } catch (error) {
            console.error("Error uploading post: ", error);
        }
    };

    useEffect(() => {
        if (usedInGroupPosting === false) {
            setIsAnonymously(false)
        }
    }, [])

    return (
        <>
            <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
                <div className="flex items-center gap-2 py-3">
                    <ProfileAvatar
                        userData={user}
                        imageStyleClass="w-11 h-11"
                        iconStyleClass="text-4xl"
                    />

                    <div onClick={() => setModalOpen(true)} className="w-full cursor-pointer rounded-3xl px-3 py-2.5 text-customGray-200 bg-customGray-default hover:bg-[#E4E6EB]">
                        {usedInGroupPosting ? 'Write something...' : `What's on your mind, ${user?.username}`}
                    </div>
                </div>

                <div className="h-[1px] w-full bg-slate-100"></div>

                <div className="grid grid-cols-3 gap-1 py-2">
                    {feedPostingOptions.map((data) => (
                        <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                            <img src={data.icon} alt={""} className="w-5" />
                            <p className="text-sm font-medium text-[#65676B]">
                                {data.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <ModalLayout isOpen={isModalOpen} containerStyle={'relative p-3 gap-3'}>
                <div className="flex justify-center">
                    <h1 className="text-lg font-bold">Create Post</h1>

                    <span
                        onClick={handleModalClose}
                        className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                    >
                        {ReactIcons.CLOSE}
                    </span>
                </div>

                <hr className="text-customGray-default" />

                {usedInGroupPosting && (
                    <div className='flex items-center justify-between py-3 px-4 rounded-lg bg-customGray-default'>
                        <h5 className='font-medium text-customGray-300'>Post anonymously</h5>

                        <ToggleButton
                            checked={isAnonymous}
                            onClick={() => setIsAnonymously(prev => !prev)}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {isAnonymous ? (
                        <div className="flex items-center gap-2.5">
                            <span className='text-[36px]'>
                                {ReactIcons.PROFILE_AVATAR}
                            </span>

                            <p className="text-sm font-semibold">Anonymous participant</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <ProfileAvatar
                                userData={user}
                                imageStyleClass="w-10 h-10"
                                iconStyleClass="text-4xl"
                            />

                            <p className="text-sm font-semibold">{user?.username}</p>
                        </div>
                    )}

                    <TextareaField
                        textareaData={{
                            rows: 4,
                            value: messageText,
                            placeholder: `${isAnonymous ? 'Submit an anonymous post...' : "What's on your mind..."}`,
                            onChange: (e) => setMessageText(e.target.value),
                        }}
                        textareaStyle={`${messageMedia.content === null ? 'text-base' : 'text-2xl'} w-full resize-none`}
                    />

                    {messageMedia.content && (
                        <div className='relative rounded-lg border border-customGray-default'>
                            {messageMedia.type === 'image' && (
                                <img src={URL.createObjectURL(messageMedia.content)} className="w-full h-56 p-1 rounded-lg object-contain" />
                            )}

                            {messageMedia.type === 'video' && (
                                <video controls className="w-full h-56 p-1 rounded-lg object-contain">
                                    <source src={URL.createObjectURL(messageMedia.content)} type="video/mp4" />
                                </video>
                            )}

                            <span
                                onClick={() => setMessageMedia({ content: '', type: '' })}
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                {ReactIcons.CLOSE}
                            </span>
                        </div>
                    )}

                    <span
                        ref={emojiBoxRef}
                        onClick={() => setIsEmojiModalOpen(!isEmojiModalOpen)}
                        className="self-end text-xl text-customGray-200 cursor-pointer hover:text-customGray-300"
                    >
                        {ReactIcons.SMILE_EMOJI}
                    </span>

                    <EmojiPicker
                        onEmojiClick={(e) => setMessageText((prev) => prev + e.emoji)}
                        className={`${isEmojiModalOpen ? '' : '!hidden'} customStyle`}
                    />
                </div>

                <div className="flex flex-col px-3 gap-2 border rounded-lg border-customGray-default p-2.5">
                    <p className="text-sm font-semibold">Add to your post</p>

                    <div className="flex items-center gap-4">
                        {feedPostingOptions.map((data) => (
                            <img
                                key={data.id}
                                src={data.icon}
                                alt={`icon of ${data.title}`}
                                onClick={() => messageMediaInputRef.current.click()}
                                className="cursor-pointer"
                            />
                        ))}
                        <input
                            ref={messageMediaInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {postLoading ? (
                    <button className='w-full flex items-center justify-center py-1.5 rounded-lg bg-customBlue-default'>
                        <div className='w-6 h-6 border-2 border-b-0 animate-spin rounded-full border-white' />
                    </button>
                ) : (
                    <button
                        onClick={handlePosting}
                        className={`${(messageText || messageMedia.content) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'} w-full font-medium py-1.5 rounded-lg cursor-pointer`}
                    >
                        {isAnonymous ? 'Submit' : 'Post'}
                    </button>
                )}
            </ModalLayout >
        </>
    )
}