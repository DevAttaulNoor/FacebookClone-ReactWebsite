import { useEffect, useState } from "react";
import { useAuth } from '@contexts/AuthContext';
import { ProfileAvatar } from '../ProfileAvatar';
import { PostingModal } from '../modals/PostingModal';

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
    const [message, setMessage] = useState({
        text: '',
        media: '',
        mediaType: ''
    });
    const [modalOpen, setModalOpen] = useState({
        emoji: false,
        posting: false,
    });
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        if (usedInGroupPosting === false) {
            setIsAnonymous(false)
        }
    }, [])

    return (
        <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
            <div className="flex items-center gap-2 py-3">
                <ProfileAvatar
                    userData={user}
                    imageStyleClass="w-[42px] h-[42px]"
                    iconStyleClass="text-[42px]"
                />

                <div onClick={() => setModalOpen(prev => ({ ...prev, posting: true }))} className="w-full text-sm cursor-pointer rounded-3xl px-3 py-2.5 text-customGray-200 bg-customGray-default hover:bg-[#E4E6EB] sm:text-base">
                    {usedInGroupPosting ? 'Write something...' : `What's on your mind, ${user?.username}`}
                </div>
            </div>

            <div className="h-[1px] w-full bg-slate-100"></div>

            <div className="grid grid-cols-2 gap-1 py-2">
                {feedPostingOptions.map((data) => (
                    <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                        <img
                            src={data.icon}
                            alt={"posting options icons"}
                            className="w-5"
                        />

                        <p className="text-sm font-medium text-[#65676B]">
                            {data.title}
                        </p>
                    </div>
                ))}
            </div>

            <PostingModal
                editingStatus={false}
                userData={user}
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
        </div>
    )
}