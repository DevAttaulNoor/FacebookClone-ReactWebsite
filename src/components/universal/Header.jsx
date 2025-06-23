import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useUsers } from "@hooks/useUsers";
import { Routes } from "@constants/Routes";
import { useAuth } from "@contexts/AuthContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { SearchBar } from "./searchBar/SearchBar";
import { ReactIcons } from "@constants/ReactIcons";
import { ChatsDropdown } from "./dropdowns/ChatsDropdown";
import { UserSearchingDropdown } from "./dropdowns/UserSearchingDropdown";
import { MenuOptionsDropdown } from "./dropdowns/MenuOptionsDropdown";
import { NotificationsDropdown } from "./dropdowns/NotificationsDropdown";
import { ProfileOptionsDropdown } from "./dropdowns/ProfileOptionsDropdown";
import fblogo from "/Images/fblogo.png";

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
    {
        id: 4,
        title: Routes.GROUP.title,
        path: Routes.GROUP_FEED.path,
        ActiveIcon: ReactIcons.GROUP,
        nonActiveIcon: ReactIcons.GROUP,
    },
];

export const Header = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState({
        userSearchDropdown: false,
        menuDropdown: false,
        profileDropdown: false,
        messageDropdown: false,
        notificationDropdown: false,
    });
    const [inputValue, setInputValue] = useState({
        userSearch: '',
        chatSearch: '',
        menuSearch: ''
    });
    const { users, usersExceptCurrent } = useUsers(user.uid);

    const headerSideOptions = [
        {
            id: 1,
            title: "Menu",
            icon: ReactIcons.MENU,
            onChange: () => setIsOpen(prev => ({ ...prev, menuDropdown: true })),
        },
        {
            id: 2,
            title: "Message",
            icon: ReactIcons.MESSAGE,
            onChange: () => setIsOpen(prev => ({ ...prev, messageDropdown: true })),
        },
        {
            id: 3,
            title: "Notification",
            icon: ReactIcons.NOTIFICATION,
            onChange: () => setIsOpen(prev => ({ ...prev, notificationDropdown: true })),
        },
    ];

    return (
        <div className="grid grid-cols-[1fr_2fr_1fr] px-3 gap-4 shadow z-30 bg-white">
            <div className="relative flex items-center gap-2 py-2">
                <Link to={Routes.HOME.path}>
                    <img
                        src={fblogo}
                        alt="logo of facebook"
                        className="max-w-10"
                    />
                </Link>

                <SearchBar
                    containerStyle="max-w-10 py-2.5 cursor-pointer lg:max-w-64"
                    containerOnClick={() => setIsOpen(prev => ({ ...prev, userSearchDropdown: true }))}
                    inputStyle={"w-full text-sm bg-transparent"}
                    inputData={{
                        type: 'text',
                        value: inputValue.userSearch,
                        placeholder: 'Search Facebook',
                        onChange: (e) => setInputValue(prev => ({ ...prev, userSearch: e.target.value }))
                    }}
                />

                <UserSearchingDropdown
                    dropdownStateData={{
                        dropdownOpen: isOpen,
                        setDropdownOpen: setIsOpen
                    }}
                    inputStateData={{
                        inputValue: inputValue,
                        setInputValue: setInputValue,
                    }}
                    usersData={usersExceptCurrent}
                />
            </div>

            <div className="flex justify-center gap-2 py-1">
                {headerLinks.map((data) => (
                    <NavLink
                        key={data.id}
                        to={data.path}
                        title={data.title}
                        className={({ isActive }) => `${isActive ? "before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-customBlue-300" : "hover:bg-customGray-default"} hidden relative items-center px-4 rounded-lg cursor-pointer sm:px-6 md:flex md:px-8 lg:px-10 xl:px-12`}
                    >
                        {({ isActive }) =>
                            isActive ? (
                                <span className="text-2xl text-customBlue-300">
                                    {data.ActiveIcon}
                                </span>
                            ) : (
                                <span className="text-2xl text-customGray-300">
                                    {data.nonActiveIcon}
                                </span>
                            )
                        }
                    </NavLink>
                ))}
            </div>

            <div className="relative flex items-center justify-end gap-2 py-2">
                {headerSideOptions.map((data) => (
                    <button
                        key={data.id}
                        title={data.title}
                        onClick={data?.onChange}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-customGray-100 p-2.5 text-2xl"
                    >
                        {data.icon}
                    </button>
                ))}

                <ProfileAvatar
                    userData={user}
                    title={"Profile"}
                    onClick={() => setIsOpen(prev => ({ ...prev, profileDropdown: true }))}
                    imageStyleClass="min-w-11 min-h-11 max-w-11 max-h-11"
                    iconStyleClass="flex items-center justify-center rounded-full bg-customGray-100 p-2.5 text-2xl"
                />

                <>
                    <MenuOptionsDropdown
                        dropdownStateData={{
                            dropdownOpen: isOpen,
                            setDropdownOpen: setIsOpen
                        }}
                    />

                    <ChatsDropdown
                        dropdownStateData={{
                            dropdownOpen: isOpen,
                            setDropdownOpen: setIsOpen
                        }}
                        searchInputStateData={{
                            inputValue: inputValue,
                            setInputValue: setInputValue,
                        }}
                        userData={user}
                        usersData={usersExceptCurrent}
                    />

                    <NotificationsDropdown
                        dropdownStateData={{
                            dropdownOpen: isOpen,
                            setDropdownOpen: setIsOpen
                        }}
                        userData={user}
                        usersData={users}
                    />

                    <ProfileOptionsDropdown
                        dropdownStateData={{
                            dropdownOpen: isOpen,
                            setDropdownOpen: setIsOpen
                        }}
                        userData={user}
                    />
                </>
            </div>
        </div>
    );
};
