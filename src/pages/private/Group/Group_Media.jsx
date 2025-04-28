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
                <h1 className="text-lg font-bold cursor-pointer hover:underline">Media</h1>

                <div className="flex items-center">
                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Add photos/video</p>
                    <span className="text-lg py-2 px-3 rounded-lg ml-1.5 cursor-pointer bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="flex gap-1">
                {groupMediaComponents.map((data) => (
                    <NavLink
                        end
                        key={data.id}
                        to={data.path}
                        className={({ isActive }) => `${isActive ? 'text-customBlue-default before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]' : 'text-customGray-300 hover:bg-customGray-default'} relative text-sm font-semibold p-4 my-1 rounded-lg cursor-pointer`}
                    >
                        {data.title}
                    </NavLink>
                ))}
            </div>

            {getActiveRoute(Routes.GROUP_MEDIA_PHOTO, location.pathname, { id: id }) && (
                <div className="grid grid-cols-5 gap-2">
                    {groupPostPhotos?.map((data) => (
                        <img
                            key={data.id}
                            src={data.media}
                            alt={`image from post of ${data.email}`}
                            className="w-full h-full object-cover"
                        />
                    ))}
                </div>
            )}

            {getActiveRoute(Routes.GROUP_MEDIA_VIDEO, location.pathname, { id: id }) && (
                <div className="grid grid-cols-5 gap-2">
                    {groupPostVideos?.map((data) => (
                        <video
                            controls
                            key={data.id}
                            className="w-full h-full object-cover"
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