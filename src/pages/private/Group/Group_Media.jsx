import { NavLink, useLocation, useParams } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { generatePath, getActiveRoute } from "@utils/PathResolver";

const Group_Media = ({ groupPosts }) => {
    const location = useLocation();
    const { id } = useParams();
    const groupPostPhotos = groupPosts?.filter(data => data?.mediaType === 'image')
    const groupPostVideos = groupPosts?.filter(data => data?.mediaType === 'video')

    const groupMediaComponents = [
        { id: 1, title: 'Photos', path: generatePath({ path: Routes.GROUP_MEDIA_PHOTO.path }, { id: id }) },
        { id: 2, title: 'Videos', path: generatePath({ path: Routes.GROUP_MEDIA_VIDEO.path }, { id: id }) },
    ];

    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline xs:text-xl">Media</h1>

                <p className="text-sm font-medium p-2 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Add photos/video</p>
            </div>

            <div className="flex gap-1 mb-2">
                {groupMediaComponents.map((data) => (
                    <NavLink
                        end
                        key={data.id}
                        to={data.path}
                        className={({ isActive }) => `${isActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-xs font-semibold p-2 my-1 rounded-lg cursor-pointer xs:p-2.5 sm:p-3 md:text-sm lg:p-3.5 2xl:p-4`}
                    >
                        {data.title}
                    </NavLink>
                ))}
            </div>

            {getActiveRoute(Routes.GROUP_MEDIA_PHOTO, location.pathname, { id: id }) && (
                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                    {groupPostPhotos?.map((data) => (
                        <img
                            key={data.id}
                            src={data.media}
                            alt={`image from post of ${data.email}`}
                            className="max-h-32 h-full w-full shadow object-contain bg-slate-100 xs:max-h-36 sm:max-h-40 md:max-h-44 lg:max-h-48 xl:max-h-52"
                        />
                    ))}
                </div>
            )}

            {getActiveRoute(Routes.GROUP_MEDIA_VIDEO, location.pathname, { id: id }) && (
                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                    {groupPostVideos?.map((data) => (
                        <video
                            controls
                            key={data.id}
                            className="max-h-32 h-full w-full shadow object-contain bg-slate-100 xs:max-h-36 sm:max-h-40 md:max-h-44 lg:max-h-48 xl:max-h-52"
                        >
                            <source src={data.media} type="video/mp4" />
                        </video>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Group_Media