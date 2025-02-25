import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";

export const FeedReel = () => {
    return (
        <Link
            to={Routes.REEL.path}
            className='w-full flex items-center p-2 rounded-lg shadow-customFull2 bg-white cursor-pointer group'
        >
            <div className="w-full flex items-center p-2 gap-2.5 rounded-lg group-hover:bg-customGray-default">
                <span className="text-2xl p-2 rounded-full text-customBlue-default bg-customGray-100">{ReactIcons.ADD_PLUS}</span>

                <div className='reelFeedInfo'>
                    <h2 className="text-lg font-semibold">Create Story</h2>
                    <p className="text-sm text-customGray-200">Share a photo or write something.</p>
                </div>
            </div>
        </Link>
    )
}