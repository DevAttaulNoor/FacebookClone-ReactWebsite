import { NavLink, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { Group_AllGroups } from "./Group_AllGroups";
import { FeedPost } from "@components/universal/FeedPost";

const groupsLeftbarOptions = [
    {
        id: 1,
        title: 'Your Feed',
        icon: ReactIcons.GROUP,
        path: Routes.GROUP.path
    },
    {
        id: 2,
        title: Routes.GROUP_LIST.title,
        icon: ReactIcons.GROUP_LIST,
        path: Routes.GROUP_LIST.path
    },
]

const Group = () => {
    const location = useLocation();

    return (
        <div className="w-full h-full flex">
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between pl-2 mb-2">
                    <p className="text-xl font-bold">Groups</p>

                    <span className="text-xl p-1.5 rounded-full bg-customGray-100 cursor-pointer hover:bg-slate-200">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex flex-col gap-1">
                    {groupsLeftbarOptions.map((data) => (
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

            <div className='w-full h-full overflow-x-hidden overflow-y-auto p-4'>
                {location.pathname === Routes.GROUP.path && (
                    <div className='flex flex-col items-center p-4'>
                        <div className="w-1/2 flex flex-col gap-2">
                            <h5 className="text-customGray-200 text-sm font-medium">Recent Activity</h5>
                            <FeedPost />
                        </div>
                    </div>
                )}

                {location.pathname === Routes.GROUP_LIST.path && (
                    <Group_AllGroups />
                )}
            </div>
        </div>
    );
};

export default Group;
