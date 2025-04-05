import { useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useReels } from "@hooks/useReels";
import { useUsers } from "@hooks/useUsers";
import { timeAgoInitials } from "@utils/TimeModule";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { ReactIcons } from "@constants/ReactIcons";

const Reel = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const { id } = useParams();
    const { users } = useUsers();
    const { reels } = useReels();
    const currentIndex = reels?.findIndex(data => data.id === id) || 0;
    const activeReelContent = reels?.[currentIndex];
    const activeReelUser = users?.find(data => data.uid === activeReelContent?.uid);

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

    const handleVideoToggle = () => {
        if (!videoRef.current) return;
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    };

    return (
        <div className='w-full h-full flex justify-center items-center py-4 gap-10 bg-black relative'>
            <button
                onClick={goToPrevReel}
                className="text-4xl p-1.5 border rotate-90 rounded-full text-white border-white"
            >
                {ReactIcons.ARROW_DOWN}
            </button>

            <div className="relative w-96 h-full">
                <video
                    loop
                    autoPlay
                    muted
                    playsInline
                    ref={videoRef}
                    onClick={handleVideoToggle}
                    className="w-full h-full rounded-md object-cover"
                >
                    <source src={activeReelContent?.video} type="video/mp4" />
                </video>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/30 to-transparent rounded-b-md z-0" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-0">
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
                    <p className="text-white mt-3">{activeReelContent?.message}</p>
                </div>
            </div>

            <button
                onClick={goToNextReel}
                className="text-4xl p-1.5 border rotate-[270deg] rounded-full text-white border-white"
            >
                {ReactIcons.ARROW_DOWN}
            </button>
        </div>
    );
};

export default Reel;