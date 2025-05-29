import { Link } from "react-router-dom";
import { useReels } from "@hooks/useReels";
import { Routes } from "@constants/Routes";
import { SvgIcons } from "@constants/SvgIcons";
import { ReelPost } from "@components/universal/post-related/ReelPost";

const Reel = () => {
    const { reels } = useReels();

    return (
        <div className='relative w-full h-screenMinusHeader flex items-center justify-center bg-black'>
            {reels.length > 0 ? (
                <ReelPost
                    reelsData={reels}
                />
            ) : (
                <div className="h-full flex items-center justify-center px-10 text-white">
                    No reels to view
                </div>
            )}

            <Link
                to={Routes.REEL_CREATE.path}
                className="absolute top-3 right-3 w-fit flex items-center justify-center py-2 px-3.5 gap-2 rounded-3xl bg-customGray-default"
            >
                <span>{SvgIcons.REEL({ styleClass: 'w-[20px] h-[20px]' })}</span>
                <p className="text-sm font-medium leading-none">Create reel</p>
            </Link>
        </div>
    );
};

export default Reel;