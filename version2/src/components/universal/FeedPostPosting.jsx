import '@assets/css/customEmojiPickerStyle.css'
import EmojiPicker from 'emoji-picker-react';
import { useRef, useState } from "react";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { ModalLayout } from "@layouts/ModalLayout";
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@services/firebase';

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

export const FeedPostPosting = () => {
    const user = useAuthUser();
    const emojiBoxRef = useRef(null);
    const messageMediaInputRef = useRef(null);
    const [messageText, setMessageText] = useState('');
    const [messageMedia, setMessageMedia] = useState({ content: '', type: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);


    console.log("User object:", user);

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
            username: user.username,
            photoURL: user.profilePhoto,
            timestamp: Math.floor(new Date().getTime() / 1000),
        };

        try {
            const postRef = doc(collection(db, "Posts")); // Create a reference to a new document in the "Posts" collection

            if ((messageText !== '') && (messageMedia.content === '')) {
                await setDoc(postRef, {
                    ...postDetails,
                    message: messageText,
                });

                handleModalClose();
                return;
            }

            if ((messageText === '') && (messageMedia.content !== '')) {
                // const storageRef = ref(storage, `Posts/${user.uid}/${messageMedia.content.name}`);
                // await uploadBytes(storageRef, messageMedia.content);
                // const mediaUrl = await getDownloadURL(storageRef);

                // const storageRef = storage.ref(`Posts/${user.uid}`);
                // await storageRef.put(messageMedia.content);
                // const mediaUrl = await storageRef.getDownloadURL();

                const file = messageMedia.content;
                const storageRef = ref(storage, `Posts/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                let mediaUrl = await getDownloadURL(storageRef);


                await setDoc(postRef, {
                    ...postDetails,
                    media: mediaUrl,
                    mediaType: messageMedia.type,
                });

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

                handleModalClose();
            }
        } catch (error) {
            console.error("Error uploading post: ", error);
        }
    };

    return (
        <div className="relative">
            <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
                <div className="flex items-center gap-2 py-3">
                    {user?.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt={`profile picture of ${user.username}`}
                            className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                        />
                    ) : (
                        <span className="text-4xl">
                            {ReactIcons.PROFILE_AVATAR}
                        </span>
                    )}

                    <div onClick={() => setModalOpen(true)} className="w-full cursor-pointer rounded-3xl bg-customGray-default px-3 py-2.5 hover:bg-[#E4E6EB]">
                        <p className="text-slate-500">{`What's on your mind, ${user.username}`}</p>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-slate-100"></div>

                <div className="grid grid-cols-3 gap-1 py-2">
                    {feedPostingOptions.map((data) => (
                        <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                            <img src={data.icon} alt={""} className="w-5" />
                            <p className="text-sm font-medium text-[#65676B]">
                                Live video
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

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt={`profile picture of ${user.username}`}
                                className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                            />
                        ) : (
                            <span className="text-4xl">
                                {ReactIcons.PROFILE_AVATAR}
                            </span>
                        )}

                        <p className="text-sm font-semibold">{user.username}</p>
                    </div>

                    <textarea
                        rows="4"
                        value={messageText}
                        placeholder="What's on your mind"
                        onChange={(e) => setMessageText(e.target.value)}
                        className={`${messageMedia ? 'text-sm' : 'text-xl'} w-full resize-none`}
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

                <button
                    onClick={handlePosting}
                    className={`${(messageText || messageMedia.content) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'} w-full font-medium py-1.5 rounded-lg cursor-pointer`}
                >
                    Post
                </button>
            </ModalLayout>
        </div>
    )
}