import { useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useReels } from "@hooks/useReels";
import { useUsers } from "@hooks/useUsers";
import { Routes } from "@constants/Routes";
import { SvgIcons } from "@constants/SvgIcons";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { timeAgoInitials } from "@utils/TimeModule";
import { handleReacting } from "@utils/ReactionHandling";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { ReactingModal } from "@components/universal/modals/ReactingModal";
import { CommentingModal } from "@components/universal/modals/CommentingModal";

const Reel = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const { id } = useParams();
    const { user } = useAuth();
    const { users } = useUsers();
    const { reels } = useReels();
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const currentIndex = reels?.findIndex(data => data.id === id) || 0;
    const activeReelContent = reels?.[currentIndex];
    const activeReelUser = users?.find(data => data.uid === activeReelContent?.uid);
    const [modalOpen, setModalOpen] = useState({
        emoji: false,
        comment: null,
        reaction: null,
    });

    const goToNextReel = () => {
        if (!reels) return;
        const nextIndex = (currentIndex + 1) % reels.length;
        navigate(`/reel/${reels[nextIndex].id}`);
    };

    const goToPrevReel = () => {
        if (!reels) return;
        const prevIndex = (currentIndex - 1 + reels.length) % reels.length;
        navigate(`/reel/${reels[prevIndex].id}`);
    };

    const handleSoundToggle = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    const handleVideoToggle = () => {
        if (!videoRef.current) return;
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        setIsPaused(videoRef.current.paused);
    };

    return (
        <div className='relative w-full h-screenMinusHeader flex items-start justify-center bg-black'>
            <div className="h-full flex justify-center items-end py-4 gap-8">
                <div className="h-full relative">
                    <div className="relative w-[420px] h-full">
                        <video
                            loop
                            autoPlay
                            playsInline
                            ref={videoRef}
                            muted={isMuted}
                            onClick={handleVideoToggle}
                            src={activeReelContent?.video}
                            className="w-full h-full rounded-md object-cover"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent rounded-t-md z-[5]" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/40 to-transparent rounded-b-md z-[5]" />

                        <div className="absolute top-0 left-0 right-0 flex items-center justify-end p-4 gap-2 z-10">
                            <button
                                onClick={handleVideoToggle}
                                className="text-xl text-white"
                            >
                                {isPaused ? ReactIcons.PLAY : ReactIcons.PAUSE}
                            </button>

                            <button
                                onClick={handleSoundToggle}
                                className="text-xl text-white"
                            >
                                {isMuted ? ReactIcons.SPEAKER_NO_SOUND : ReactIcons.SPEAKER_SOUND}
                            </button>

                            <span className="text-xl cursor-pointer text-white">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                            <div className="flex items-center gap-2">
                                <ProfileAvatar
                                    userData={activeReelUser}
                                    imageStyleClass="w-10 h-10"
                                    iconStyleClass="text-4xl"
                                />
                                <div className='flex flex-col text-white'>
                                    <Link
                                        to={`/profile/${activeReelUser?.uid}`}
                                        className="font-medium cursor-pointer hover:underline"
                                    >
                                        {activeReelUser?.username}
                                    </Link>
                                    <p className="text-sm">{timeAgoInitials(activeReelContent?.timestamp)}</p>
                                </div>
                            </div>

                            {activeReelContent?.message && (
                                <p className="text-white mt-3">{activeReelContent?.message}</p>
                            )}
                        </div>
                    </div>

                    {currentIndex > 0 && (
                        <button
                            onClick={goToPrevReel}
                            className="absolute top-1/2 -left-20 -translate-y-1/2 text-[32px] p-1.5 border-[3px] rotate-90 rounded-full text-customGray-100"
                        >
                            {ReactIcons.ARROW_DOWN}
                        </button>
                    )}

                    <button
                        onClick={goToNextReel}
                        className="absolute top-1/2 -right-20 -translate-y-1/2 text-[32px] p-1.5 border-[3px] rotate-[270deg] rounded-full text-customGray-100"
                    >
                        {ReactIcons.ARROW_DOWN}
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-0.5">
                        <span
                            onClick={() => handleReacting('Reels', activeReelContent, user?.uid)}
                            className="text-[22px] p-3.5 rounded-full cursor-pointer text-white bg-[#1a1a1a] hover:bg-[#313131]"
                        >
                            {ReactIcons.LIKE}
                        </span>

                        {activeReelContent?.reactions?.length > 0 && (
                            <p
                                onClick={() => setModalOpen(prev => ({ ...prev, reaction: activeReelContent?.id }))}
                                className="text-sm cursor-pointer text-white"
                            >
                                {activeReelContent?.reactions?.length}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                        <span
                            onClick={() => setModalOpen(prev => ({ ...prev, comment: activeReelContent?.id }))}
                            className="text-[22px] p-3.5 rounded-full cursor-pointer text-white bg-[#1a1a1a] hover:bg-[#313131]"
                        >
                            {ReactIcons.COMMENT}
                        </span>

                        {activeReelContent?.comments?.length > 0 && (
                            <p
                                onClick={() => setModalOpen(prev => ({ ...prev, comment: activeReelContent?.id }))}
                                className="text-sm cursor-pointer text-white"
                            >
                                {activeReelContent?.comments?.length}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={Routes.REEL_CREATE.path}
                className="absolute top-3 right-3 w-fit flex items-center justify-center py-2 px-3.5 gap-2 rounded-3xl bg-customGray-default"
            >
                <span>{SvgIcons.REEL({ styleClass: 'w-[20px] h-[20px]' })}</span>
                <p className="text-sm font-medium leading-none">Create reel</p>
            </Link>

            {modalOpen.comment === activeReelContent?.id && (
                <CommentingModal
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    entity={'Reels'}
                    userData={user}
                    usersData={users}
                    enityData={activeReelContent}
                />
            )}

            {modalOpen.reaction === activeReelContent?.id && (
                <ReactingModal
                    modalStateData={{
                        modalOpen: modalOpen,
                        setModalOpen: setModalOpen
                    }}
                    entityData={activeReelContent}
                    usersData={users}
                />
            )}
        </div>
    );
};

export default Reel;