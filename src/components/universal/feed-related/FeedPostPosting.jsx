import '@assets/css/customEmojiPickerStyle.css'
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from "react";
import { useAuth } from '@contexts/AuthContext';
import { ProfileAvatar } from '../ProfileAvatar';
import { ReactIcons } from '@constants/ReactIcons';
import { ModalLayout } from '@layouts/ModalLayout';
import { handlePosting } from '@utils/PostHandling';
import { BasicButton } from '../buttons/BasicButton';
import { ToggleButton } from '../buttons/ToggleButton';
import { TextareaField } from '../inputs/TextareaField';
import { handleMediaChange } from '@utils/MediaHandling';

const feedPostingOptions = [
    {
        id: 1,
        title: "Photo/video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j",
    },
    {
        id: 2,
        title: "Feeling/activity",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77",
    },
];

export const FeedPostPosting = ({ usedInGroupPosting = false, groupData }) => {
    const { user } = useAuth();
    const messageMediaRef = useRef(null);
    const [message, setMessage] = useState({
        text: '',
        media: '',
        mediaType: ''
    });
    const [modalOpen, setModalOpen] = useState({
        emoji: false,
        posting: false,
    });
    const [postLoading, setPostLoading] = useState(false);
    const [isAnonymous, setIsAnonymously] = useState(false);

    const handleModalClose = () => {
        setModalOpen({ emoji: false, posting: false })
        setMessage({ text: '', media: '', mediaType: '' })
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

                    <div onClick={() => setModalOpen(prev => ({ ...prev, posting: true }))} className="w-full text-sm cursor-pointer rounded-3xl px-3 py-2.5 text-customGray-200 bg-customGray-default hover:bg-[#E4E6EB] sm:text-base">
                        {usedInGroupPosting ? 'Write something...' : `What's on your mind, ${user?.username}`}
                    </div>
                </div>

                <div className="h-[1px] w-full bg-slate-100"></div>

                <div className="grid grid-cols-2 gap-1 py-2">
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

            <ModalLayout isOpen={modalOpen.posting} containerStyle={'relative p-3 gap-3'}>
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
                            value: message.text,
                            placeholder: `${isAnonymous ? 'Submit an anonymous post...' : "What's on your mind..."}`,
                            onChange: (e) => setMessage(prev => ({ ...prev, text: e.target.value })),
                        }}
                        textareaStyle={`${message.media === null ? 'text-base' : 'text-2xl'} w-full resize-none`}
                    />

                    {message.media && (
                        <div className='relative rounded-lg border border-customGray-default'>
                            {message.mediaType === 'image' && (
                                <img src={URL.createObjectURL(message.media)} className="w-full h-56 p-1 rounded-lg object-contain" />
                            )}

                            {message.mediaType === 'video' && (
                                <video controls className="w-full h-56 p-1 rounded-lg object-contain">
                                    <source src={URL.createObjectURL(message.media)} type="video/mp4" />
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
                        onClick={() => setModalOpen(prev => ({ ...prev, emoji: !prev.emoji }))}
                        className="self-end text-xl text-customGray-200 cursor-pointer hover:text-customGray-300"
                    >
                        {ReactIcons.SMILE_EMOJI}
                    </span>

                    {modalOpen.emoji && (
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

                {postLoading ? (
                    <BasicButton
                        btnStyleClass='!py-2 bg-customBlue-default'
                        btnData={{
                            textStyleClass: 'w-6 h-6 border-2 border-b-0 animate-spin rounded-full border-white'
                        }}
                    />
                ) : (
                    <BasicButton
                        btnStyleClass={`${(message.text || message.media) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'}`}
                        btnData={{
                            text: isAnonymous ? 'Submit' : 'Post',
                            onClick: () => handlePosting(message, null, user, groupData, usedInGroupPosting, isAnonymous, setPostLoading, handleModalClose)
                        }}
                    />
                )}
            </ModalLayout>
        </>
    )
}