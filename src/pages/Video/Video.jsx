import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { Video_Saved } from "./Video_Saved";
import { FeedPost } from "@components/universal/FeedPost";

const videosLeftbarOptions = [
    {
        id: 1,
        title: 'Home',
        icon: ReactIcons.VIDEO,
        path: Routes.VIDEO.path
    },
    {
        id: 2,
        title: 'Saved Videos',
        icon: ReactIcons.SAVED,
        path: Routes.VIDEO_SAVED.path
    },
]

const Video = () => {
    const location = useLocation();

    return (
        <div className="w-full h-full flex">
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between pl-2 mb-2">
                    <p className="text-xl font-bold">Video</p>

                    <span className="text-xl p-1.5 rounded-full bg-customGray-100 cursor-pointer hover:bg-slate-200">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex flex-col gap-1">
                    {videosLeftbarOptions.map((data) => (
                        <NavLink
                            end
                            key={data.id}
                            to={data.path}
                            className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center p-2 gap-2 rounded-lg cursor-pointer`}
                        >
                            <span className="text-xl p-1.5 rounded-full bg-customGray-100">{data.icon}</span>
                            <p className="font-medium">{data.title}</p>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
                {location.pathname === Routes.VIDEO.path && (
                    <div className='flex flex-col items-center p-4'>
                        <FeedPost postContainerStyle="w-2/3" />
                    </div>
                )}

                {location.pathname === Routes.VIDEO_SAVED.path && (
                    <Video_Saved />
                )}
            </div>
        </div>
    );
};

export default Video;
