import '@assets/css/customEmojiPickerStyle.css'
import EmojiPicker from 'emoji-picker-react';
import { useRef, useState } from "react"
import { ProfileAvatar } from "../ProfileAvatar"
import { ModalLayout } from "@layouts/ModalLayout"
import { ReactIcons } from "@constants/ReactIcons"
import { handlePosting } from "@utils/PostHandling"
import { BasicButton } from "../buttons/BasicButton"
import { ToggleButton } from "../buttons/ToggleButton"
import { TextareaField } from "../inputs/TextareaField"
import { handleMediaChange } from "@utils/MediaHandling"

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

export const PostingModal = ({
    editingStatus,
    userData,
    postData,
    groupData,
    modalStateData,
    messageStateData,
    anonymousStateData,
    usedInGroupPosting,
}) => {
    const messageMediaRef = useRef(null);
    const [postLoading, setPostLoading] = useState(false);

    const handleModalClose = () => {
        if (!editingStatus) {
            anonymousStateData.setIsAnonymous(false)
        }
        modalStateData.setModalOpen({ emoji: false, posting: false })
        messageStateData.setMessage({ text: '', media: '', mediaType: '' })
    };

    return (
        <ModalLayout
            isOpen={editingStatus ? true : modalStateData.modalOpen.posting}
            containerStyle={'relative p-3 gap-3'}
        >
            <div className="flex justify-center">
                <h1 className="text-lg font-bold">{editingStatus ? 'Edit' : 'Create'} Post</h1>

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
                        checked={anonymousStateData.isAnonymous}
                        onClick={() => anonymousStateData.setIsAnonymous(prev => !prev)}
                    />
                </div>
            )}

            <div className="flex flex-col gap-3">
                {anonymousStateData.isAnonymous ? (
                    <div className="flex items-center gap-2.5">
                        <span className='text-[36px]'>
                            {ReactIcons.PROFILE_AVATAR}
                        </span>

                        <p className="text-sm font-semibold">Anonymous participant</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <ProfileAvatar
                            userData={userData}
                            imageStyleClass="w-10 h-10"
                            iconStyleClass="text-4xl"
                        />

                        <p className="text-sm font-semibold">{userData?.username}</p>
                    </div>
                )}

                <TextareaField
                    textareaData={{
                        rows: 4,
                        value: messageStateData.message.text,
                        placeholder: `${anonymousStateData.isAnonymous ? 'Submit an anonymous post...' : "What's on your mind..."}`,
                        onChange: (e) => messageStateData.setMessage(prev => ({ ...prev, text: e.target.value })),
                    }}
                    textareaStyle={`${messageStateData.message.media === null ? 'text-base' : 'text-2xl'} w-full resize-none`}
                />

                {messageStateData.message.media && (
                    <div className='relative rounded-lg border border-customGray-default'>
                        {messageStateData.message.mediaType === 'image' && (
                            <img src={messageStateData.message.media} className="w-full h-56 p-1 rounded-lg object-contain" />
                        )}

                        {messageStateData.message.mediaType === 'video' && (
                            <video controls className="w-full h-56 p-1 rounded-lg object-contain">
                                <source src={messageStateData.message.media} type="video/mp4" />
                            </video>
                        )}

                        <span
                            onClick={() => messageStateData.setMessage(prev => ({ ...prev, media: '', mediaType: '' }))}
                            className="absolute top-2 right-2 cursor-pointer"
                        >
                            {ReactIcons.CLOSE}
                        </span>
                    </div>
                )}

                <span
                    onClick={() => modalStateData.setModalOpen(prev => ({ ...prev, emoji: !prev.emoji }))}
                    className="self-end text-xl text-customGray-200 cursor-pointer hover:text-customGray-300"
                >
                    {ReactIcons.SMILE_EMOJI}
                </span>

                {modalStateData.modalOpen.emoji && (
                    <EmojiPicker
                        onEmojiClick={(e) => messageStateData.setMessage(prev => ({ ...prev, text: prev.text + e.emoji }))}
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
                        onChange={(e) => handleMediaChange(e, messageStateData.setMessage)}
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
                <>
                    {editingStatus ? (
                        <BasicButton
                            btnStyleClass={`${(messageStateData.message.text || messageStateData.message.media) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'}`}
                            btnData={{
                                text: 'Save',
                                onClick: () => handlePosting(messageStateData.message, postData, userData, groupData, usedInGroupPosting, anonymousStateData.isAnonymous, setPostLoading, handleModalClose, true)
                            }}
                        />
                    ) : (
                        <BasicButton
                            btnStyleClass={`${(messageStateData.message.text || messageStateData.message.media) ? 'text-white bg-customBlue-default' : 'text-customGray-200 bg-customGray-100'}`}
                            btnData={{
                                text: anonymousStateData.isAnonymous ? 'Submit' : 'Post',
                                onClick: () => handlePosting(messageStateData.message, null, userData, groupData, usedInGroupPosting, anonymousStateData.isAnonymous, setPostLoading, handleModalClose)
                            }}
                        />
                    )}
                </>
            )}
        </ModalLayout>
    )
}
