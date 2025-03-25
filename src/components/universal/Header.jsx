import { useState } from "react";
import { signOut } from "firebase/auth";
import { Link, NavLink, useNavigate } from "react-router";
import { auth } from "@services/firebase";
import { Routes } from "@constants/Routes";
import { useUsers } from "@hooks/useUsers";
import { useChats } from "@hooks/useChats";
import { ProfileAvatar } from "./ProfileAvatar";
import { useAuthUser } from "@hooks/useAuthUser";
import { InputField } from "./inputs/InputField";
import { ReactIcons } from "@constants/ReactIcons";
import { timeAgoInitials } from "@utils/TimeModule";
import { BasicDropdown } from "./dropdowns/BasicDropdown";
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
];

export const Header = () => {
    const navigate = useNavigate();
    const { chats } = useChats();
    const { user } = useAuthUser();
    const { users, usersExceptCurrent } = useUsers(user.uid);
    const [active, setActive] = useState('All');
    const [isOpen, setIsOpen] = useState({
        userSearchDropdown: false,
        profileDropdown: false,
        messageDropdown: false,
        notificationDropdown: false,
    });
    const [inputValue, setInputValue] = useState({
        userSearch: '',
        chatSearch: ''
    });
    const searchedUser = usersExceptCurrent?.filter((data) => data?.username?.toLowerCase().includes(inputValue.userSearch.toLowerCase()));

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate(Routes.LOGIN.path)
        } catch (error) {
            console.error(error);
        }
    }

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
            onChange: () => setIsOpen(prev => ({ ...prev, messageDropdown: true })),
        },
        {
            id: 3,
            title: "Notification",
            icon: ReactIcons.NOTIFICATION,
            onChange: () => setIsOpen(prev => ({ ...prev, notificationDropdown: true })),
        },
    ];

    const profileDropdownOptions = [
        {
            id: 1,
            text: 'Setting & privacy',
            icon: ReactIcons.SETTING,
        },
        {
            id: 2,
            text: 'Help & support',
            icon: ReactIcons.SETTING,
        },
        {
            id: 3,
            text: 'Display & accessibility',
            icon: ReactIcons.SETTING,
        },
        {
            id: 4,
            text: 'Log out',
            icon: ReactIcons.SETTING,
            onClick: () => handleLogout()
        }
    ];

    return (
        <div className="sticky top-0 z-30 grid grid-cols-[1fr_2fr_1fr] bg-white px-3 shadow">
            <div className="relative flex items-center gap-2 py-2">
                <Link to={Routes.HOME.path}>
                    <img
                        src={fblogo}
                        alt="logo of facebook"
                        className="w-10"
                    />
                </Link>

                <div
                    onClick={() => setIsOpen(prev => ({ ...prev, userSearchDropdown: true }))}
                    className="flex w-full max-w-64 items-center gap-1.5 rounded-3xl bg-customGray-default px-3"
                >
                    <span className="text-customGray-200">
                        {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                    </span>

                    <InputField
                        inputStyle="w-full bg-transparent py-2.5 text-sm"
                        inputData={{
                            type: 'text',
                            value: inputValue.userSearch,
                            placeholder: 'Search Facebook',
                            onChange: (e) => setInputValue(prev => ({ ...prev, userSearch: e.target.value }))
                        }}
                    />
                </div>

                <BasicDropdown
                    isOpen={isOpen.userSearchDropdown}
                    isClose={() => setIsOpen(prev => ({ ...prev, userSearchDropdown: false }))}
                    dropdownContainerStyle="dropdownContainerStyle1 top-0 -left-[10px] max-h-96 shadow-xl"
                >
                    <div className="flex items-center gap-2">
                        <span
                            onClick={() => setIsOpen(prev => ({ ...prev, userSearchDropdown: false }))}
                            className="text-xl p-2.5 rounded-full cursor-pointer bg-customGray-default hover:bg-customGray-100"
                        >
                            {ReactIcons.ARROW_LEFT}
                        </span>

                        <div className="flex w-full max-w-64 items-center gap-1.5 rounded-3xl bg-customGray-default px-3">
                            <span className="text-customGray-200">
                                {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                            </span>

                            <InputField
                                inputStyle="w-full bg-transparent py-2.5 text-sm"
                                inputData={{
                                    type: 'text',
                                    value: inputValue.userSearch,
                                    placeholder: 'Search Facebook',
                                    onChange: (e) => setInputValue(prev => ({ ...prev, userSearch: e.target.value }))
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 overflow-y-auto">
                        {searchedUser?.length > 0 ? (
                            <>
                                {searchedUser?.map(data => (
                                    <Link
                                        key={data.uid}
                                        to={`/profile/${data.uid}`}
                                        className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                                    >
                                        <ProfileAvatar
                                            userData={data}
                                            imageStyleClass="w-9 h-9"
                                            iconStyleClass="flex items-center justify-center text-xl p-2 rounded-full bg-customGray-100"
                                        />

                                        <p className="text-sm font-medium">{data.username}</p>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <p className="text-center py-2 text-customGray-300">No match found</p>
                        )}
                    </div>
                </BasicDropdown>
            </div>

            <div className="flex justify-center gap-2 py-1">
                {headerLinks.map((data) => (
                    <NavLink
                        key={data.id}
                        to={data.path}
                        title={data.title}
                        className={({ isActive }) =>
                            `${isActive ? "before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:bg-customBlue-300" : "hover:bg-customGray-default"} relative flex cursor-pointer items-center rounded-lg px-12`
                        }
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

                <button
                    title={"Profile"}
                    onClick={() => setIsOpen(prev => ({ ...prev, profileDropdown: true }))}
                    className="cursor-pointer"
                >
                    <ProfileAvatar
                        userData={user}
                        imageStyleClass="w-11 h-11"
                        iconStyleClass="flex items-center justify-center rounded-full bg-customGray-100 p-2.5 text-2xl"
                    />
                </button>

                <>
                    <BasicDropdown
                        isOpen={isOpen.messageDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, messageDropdown: false }))}
                        dropdownData={{ title: 'Chats' }}
                        dropdownContainerStyle="dropdownContainerStyle1 p-2"
                    >
                        <div className="flex w-full items-center gap-1.5 rounded-3xl bg-customGray-default px-3">
                            <span className="text-customGray-200">{ReactIcons.SEARCH_MAGNIFYINGGLASS}</span>

                            <InputField
                                inputStyle="w-full bg-transparent py-2.5 text-sm"
                                inputData={{
                                    type: 'text',
                                    value: inputValue.chatSearch,
                                    placeholder: 'Search Messenger',
                                    onChange: (e) => setInputValue(prev => ({ ...prev, chatSearch: e.target.value }))
                                }}
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            {chats?.map((data, index) => {
                                const chatUser = users?.find(elem => (elem.uid === data.chats[0].senderId) || (elem.uid === data.chats[0].receiverId))

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center p-1 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                                    >
                                        <ProfileAvatar
                                            userData={chatUser}
                                            imageStyleClass="w-12 h-12"
                                            iconStyleClass="text-5xl"
                                        />

                                        <div className="flex flex-col text-sm">
                                            <Link
                                                to={`/profile/${chatUser?.uid}`}
                                                className="text-sm font-medium cursor-pointer hover:underline"
                                            >
                                                {chatUser?.username}
                                            </Link>

                                            <p className="text-customGray-300">{data.chats[data.chats.length - 1].message} • {timeAgoInitials(data.timestamp)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </BasicDropdown>

                    <BasicDropdown
                        isOpen={isOpen.notificationDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, notificationDropdown: false }))}
                        dropdownData={{ title: 'Notification' }}
                        dropdownContainerStyle="dropdownContainerStyle1 p-2"
                    >
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setActive('All')}
                                className={`${active === 'All' ? 'text-customBlue-300 bg-customBlue-100' : 'text-black'} text-sm font-medium py-1.5 px-3 rounded-2xl cursor-pointer hover:bg-customGray-100`}
                            >
                                All
                            </button>

                            <button
                                onClick={() => setActive('Unread')}
                                className={`${active === 'Unread' ? 'text-customBlue-300 bg-customBlue-100' : 'text-black'} text-sm font-medium py-1.5 px-3 rounded-2xl cursor-pointer hover:bg-customGray-100`}
                            >
                                Unread
                            </button>
                        </div>

                        <div className='flex flex-col gap-1'>
                            {user?.notifications?.map((data, index) => {
                                const notificationRelatedUser = users?.find(elem => (elem.uid === data.uid) || (elem.uid === data.friendId))

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center p-1 gap-3 rounded-md cursor-pointer hover:bg-customGray-default"
                                    >
                                        <ProfileAvatar
                                            userData={notificationRelatedUser}
                                            imageStyleClass="w-12 h-12"
                                            iconStyleClass="text-5xl"
                                        />

                                        {data.postId && (
                                            <div className="flex flex-col">
                                                <div className="text-sm">
                                                    <Link
                                                        to={`/profile/${notificationRelatedUser?.uid}`}
                                                        className="text-sm font-medium cursor-pointer hover:underline"
                                                    >
                                                        {notificationRelatedUser?.username}
                                                    </Link>

                                                    {''} has {data.status} on your post
                                                </div>

                                                <p className="text-xs text-customGray-300">{timeAgoInitials(data.timestamp)}</p>
                                            </div>
                                        )}

                                        {data.friendId && (
                                            <div className="flex flex-col">
                                                <div className="text-sm">
                                                    <Link
                                                        to={`/profile/${notificationRelatedUser?.uid}`}
                                                        className="text-sm font-medium cursor-pointer hover:underline"
                                                    >
                                                        {notificationRelatedUser?.username}
                                                    </Link>

                                                    {''} has sent you a friend request
                                                </div>

                                                <p className="text-xs text-customGray-300">{timeAgoInitials(data.timestamp)}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </BasicDropdown>

                    <BasicDropdown
                        isOpen={isOpen.profileDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, profileDropdown: false }))}
                        dropdownContainerStyle="dropdownContainerStyle1 gap-1"
                    >
                        <Link
                            to={`/profile/${user.uid}`}
                            className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                        >
                            <ProfileAvatar
                                userData={user}
                                imageStyleClass="w-9 h-9"
                                iconStyleClass="flex items-center justify-center text-xl p-2 rounded-full bg-customGray-100"
                            />

                            <p className="text-sm font-medium">{user.username}</p>
                        </Link>

                        {profileDropdownOptions.map((data) => (
                            <div
                                key={data.id}
                                onClick={data?.onClick}
                                className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                            >
                                <span className="text-xl p-2 rounded-full bg-customGray-100">{data.icon}</span>
                                <p className="text-sm font-medium">{data.text}</p>
                            </div>
                        ))}

                        <p className="text-xs whitespace-pre-wrap px-1.5 mt-1.5 text-customGray-300">
                            <span className="cursor-pointer hover:underline">Privacy</span> · <span className="cursor-pointer hover:underline">Terms</span> · <span className="cursor-pointer hover:underline">Advertising</span> · <span className="cursor-pointer hover:underline">Ad choices</span> · <span className="cursor-pointer hover:underline">Cookies</span> · <span className="cursor-pointer hover:underline">More</span> · <span className="cursor-pointer hover:underline">Meta © 2023</span>
                        </p>
                    </BasicDropdown>
                </>
            </div>
        </div>
    );
};
