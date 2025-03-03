import React from "react";
import { Link, NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import fblogo from "/Images/fblogo.png";
import { useAuthUser } from "@hooks/useAuthUser";

const headerLinks = [
    {
        id: 1,
        title: Routes.HOME.title,
        path: Routes.HOME.path,
        ActiveIcon: ReactIcons.HOME,
        nonActiveIcon: ReactIcons.HOME_OUTLINED,
    },
    {
        id: 2,
        title: Routes.FRIEND.title,
        path: Routes.FRIEND.path,
        ActiveIcon: ReactIcons.FRIEND,
        nonActiveIcon: ReactIcons.FRIEND_OUTLINED,
    },
    {
        id: 3,
        title: Routes.VIDEO.title,
        path: Routes.VIDEO.path,
        ActiveIcon: ReactIcons.VIDEO,
        nonActiveIcon: ReactIcons.VIDEO_OUTLINED,
    },
];

const headerSideOptions = [
    {
        id: 1,
        title: "Menu",
        icon: ReactIcons.MENU,
    },
    {
        id: 2,
        title: "Message",
        icon: ReactIcons.MESSAGE,
    },
    {
        id: 3,
        title: "Notification",
        icon: ReactIcons.NOTIFICATION,
    },
];

export const Header = () => {
    const user = useAuthUser();

    return (
        <div className="sticky top-0 z-30 grid grid-cols-[1fr_2fr_1fr] bg-white px-3 shadow">
            <div className="flex gap-2 py-2">
                <Link to={Routes.HOME.path} className="h-11 w-11">
                    <img
                        src={fblogo}
                        alt="logo of facebook"
                        className="h-full w-full"
                    />
                </Link>

                <div className="flex w-full max-w-64 items-center justify-between gap-2 rounded-3xl bg-customGray-default px-2.5">
                    <span className="text-lg text-slate-600">
                        {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                    </span>

                    <input
                        type="text"
                        placeholder="Search Facebook"
                        className="w-full bg-transparent py-2 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-center gap-2 py-1">
                {headerLinks.map((data) => (
                    <NavLink
                        key={data.id}
                        to={data.path}
                        title={data.title}
                        className={({ isActive }) =>
                            `${isActive ? "before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-[#2381fa]" : "hover:bg-slate-100"} relative flex cursor-pointer items-center rounded-lg px-12`
                        }
                    >
                        {({ isActive }) =>
                            isActive ? (
                                <span className="text-2xl text-[#2381fa]">
                                    {data.ActiveIcon}
                                </span>
                            ) : (
                                <span className="text-2xl text-[#65676B]">
                                    {data.nonActiveIcon}
                                </span>
                            )
                        }
                    </NavLink>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 py-2">
                {headerSideOptions.map((data) => (
                    <span
                        key={data.id}
                        title={data.title}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-[#E4E6EB] p-2.5 text-2xl"
                    >
                        {data.icon}
                    </span>
                ))}

                {user.profilePhoto ? (
                    <img
                        src={user.profilePhoto}
                        alt={`profile picture of ${user.username}`}
                        className="w-11 h-11 rounded-full border border-customGray-100 object-contain bg-white"
                    />
                ) : (
                    <span
                        title={"Profile"}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-[#E4E6EB] p-2.5 text-2xl"
                    >
                        {ReactIcons.PROFILE_AVATAR}
                    </span>
                )}
            </div>
        </div>
    );
};
