import { useState } from "react";
import { signOut } from "firebase/auth";
import { Link, NavLink } from "react-router";
import { auth } from "@services/firebase";
import { useChats } from "@hooks/useChats";
import { useUsers } from "@hooks/useUsers";
import { Routes } from "@constants/Routes";
import { SvgIcons } from "@constants/SvgIcons";
import { useAuth } from "@contexts/AuthContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { TermsAndLinks } from "./TermsAndLinks";
import { InputField } from "./inputs/InputField";
import { SearchBar } from "./searchBar/SearchBar";
import { ReactIcons } from "@constants/ReactIcons";
import { timeAgoInitials } from "@utils/TimeModule";
import { BasicDropdown } from "./dropdowns/BasicDropdown";
import { useMessageBox } from "@contexts/MessageBoxContext";
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
    const { users, usersExceptCurrent } = useUsers(user.uid);
    const { setSelectedMessageUser, setIsMessageBoxOpen } = useMessageBox();
    const { userChats } = useChats(user.uid, usersExceptCurrent.map(data => data.uid));
    const [active, setActive] = useState('All');
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
    const searchedUser = usersExceptCurrent?.filter((data) => data?.username?.toLowerCase().includes(inputValue.userSearch.toLowerCase()));

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    }

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

    const headerMenuCreateOptions = [
        {
            id: 1,
            title: "Post",
            icon: ReactIcons.EDIT_PENCIL_BOX,
        },
        {
            id: 2,
            title: "Story",
            icon: SvgIcons.STORY({ styleClass: 'w-[22px] h-[20px]' }),
            link: Routes.STORY_CREATE.path,
        },
        {
            id: 3,
            title: "Reel",
            icon: SvgIcons.REEL({ styleClass: 'w-[22px] h-[20px]' }),
            link: Routes.REEL_CREATE.path,
        },
        {
            id: 4,
            title: "Group",
            icon: ReactIcons.GROUP,
            link: Routes.GROUP_CREATE.path,
        },
    ];

    const headerMenuOptions = [
        {
            id: 1,
            title: "Friends",
            description: 'Search for friends or people you may know.',
            icon: ReactIcons.FRIEND,
            link: Routes.FRIEND.path
        },
        {
            id: 2,
            title: "Groups",
            description: 'Connect with people who share your interests.',
            icon: ReactIcons.GROUP,
            link: Routes.GROUP_FEED.path
        },
        {
            id: 3,
            title: "Feeds",
            description: 'See the most recent posts from your friends, groups and more.',
            icon: SvgIcons.FEED({ styleClass: 'w-[29px] h-[26px]' }),
            link: Routes.FEED.path
        },
        {
            id: 4,
            title: "Videos",
            description: 'A video destination personalized to your interests and connection.',
            icon: ReactIcons.VIDEO,
            link: Routes.VIDEO.path
        },
        {
            id: 5,
            title: "Saved",
            description: 'Find posts, photos and videos that you have saved for later.',
            icon: SvgIcons.SAVED({ styleClass: 'w-[29px] h-[26px]' }),
            link: Routes.SAVED.path
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

                <BasicDropdown
                    isOpen={isOpen.userSearchDropdown}
                    isClose={() => setIsOpen(prev => ({ ...prev, userSearchDropdown: false }))}
                    dropdownContainerStyle="dropdownContainerStyle1 top-0 -left-[10px] max-h-96 shadow-xl z-10"
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
                    <BasicDropdown
                        isOpen={isOpen.menuDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, menuDropdown: false }))}
                        dropdownData={{ title: 'Menu' }}
                        dropdownContainerStyle="dropdownContainerStyle1 !w-80 p-3 xs:!w-96 sm:!w-[420px] "
                    >
                        <div className="flex gap-4">
                            <div className="flex-[0.7] flex flex-col p-2 rounded-lg shadow-customFull bg-white">
                                <div className="py-2">
                                    <SearchBar
                                        inputStyle={"w-full bg-transparent py-2.5 text-sm"}
                                        inputData={{
                                            type: 'text',
                                            value: inputValue.menuSearch,
                                            placeholder: 'Search menu',
                                            onChange: (e) => setInputValue(prev => ({ ...prev, menuSearch: e.target.value }))
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    {headerMenuOptions.map(data => (
                                        <Link
                                            key={data.id}
                                            to={data.link}
                                            className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                                        >
                                            <span className="text-3xl">{data.icon}</span>

                                            <div className="flex flex-col gap-0.5">
                                                <h5 className="text-sm font-medium">{data.title}</h5>
                                                <p className="text-xs text-customGray-200">{data.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="h-fit flex-[0.3] flex flex-col p-2 rounded-lg shadow-customFull bg-white">
                                <h2 className="text-lg font-semibold mb-2">Create</h2>

                                <div className="flex flex-col gap-1">
                                    {headerMenuCreateOptions.map((data) => (
                                        <Link
                                            key={data.id}
                                            to={data?.link}
                                            className='flex items-center px-1.5 py-2 gap-2 rounded-lg cursor-pointer hover:bg-customGray-default'
                                        >
                                            <span className="flex items-center justify-center p-1.5 text-2xl rounded-full cursor-pointer bg-customGray-100">
                                                {data.icon}
                                            </span>

                                            <h5 className="text-sm font-medium">{data.title}</h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </BasicDropdown>

                    <BasicDropdown
                        isOpen={isOpen.messageDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, messageDropdown: false }))}
                        dropdownData={{ title: 'Chats' }}
                        dropdownContainerStyle="dropdownContainerStyle1 p-3"
                    >
                        <SearchBar
                            inputStyle={"w-full bg-transparent py-2.5 text-sm"}
                            inputData={{
                                type: 'text',
                                value: inputValue.chatSearch,
                                placeholder: 'Search Messenger',
                                onChange: (e) => setInputValue(prev => ({ ...prev, chatSearch: e.target.value }))
                            }}
                        />

                        <div className='headerOptionDropdownContentStyle'>
                            {userChats?.map((data, index) => {
                                const chatUser = usersExceptCurrent?.find(elem => (elem.uid === data.chats[0].senderId) || (elem.uid === data.chats[0].receiverId))

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setIsMessageBoxOpen(true);
                                            setSelectedMessageUser(chatUser?.id);
                                            setIsOpen(prev => ({ ...prev, messageDropdown: false }));
                                        }}
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
                                                onClick={() => setIsOpen(prev => ({ ...prev, messageDropdown: false }))}
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
                        dropdownContainerStyle="dropdownContainerStyle1 p-3"
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

                        <div className='headerOptionDropdownContentStyle'>
                            {user?.notifications?.map((data, index) => {
                                const notificationRelatedUser = users?.find(elem => (elem.uid === data.uid) || (elem.uid === data.friendId))

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center p-1 gap-2 rounded-md cursor-pointer hover:bg-customGray-default xs:gap-2.5 sm:gap-3"
                                    >
                                        <ProfileAvatar
                                            userData={notificationRelatedUser}
                                            imageStyleClass="w-12 h-12"
                                            iconStyleClass="text-5xl"
                                        />

                                        {data.postId && (
                                            <div className="flex flex-col">
                                                <div className="text-xs sm:text-sm">
                                                    <Link
                                                        to={`/profile/${notificationRelatedUser?.uid}`}
                                                        className="text-xs font-medium cursor-pointer hover:underline sm:text-sm"
                                                    >
                                                        {notificationRelatedUser?.username}
                                                    </Link>

                                                    {''} has {data.status} on your post
                                                </div>

                                                <p className="text-[10px] text-customGray-300 sm:text-xs">{timeAgoInitials(data.timestamp)}</p>
                                            </div>
                                        )}

                                        {data.friendId && (
                                            <div className="flex flex-col">
                                                <div className="text-xs sm:text-sm">
                                                    <Link
                                                        to={`/profile/${notificationRelatedUser?.uid}`}
                                                        className="text-xs font-medium cursor-pointer hover:underline sm:text-sm"
                                                    >
                                                        {notificationRelatedUser?.username}
                                                    </Link>

                                                    {data.status === 'sent' ? (
                                                        `${``} has ${data.status} you a friend request`
                                                    ) : (
                                                        `${``} has ${data.status} your friend request`
                                                    )}
                                                </div>

                                                <p className="text-[10px] text-customGray-300 sm:text-xs">{timeAgoInitials(data.timestamp)}</p>
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
                            onClick={() => setIsOpen(prev => ({ ...prev, profileDropdown: false }))}
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
                                onClick={() => {
                                    data?.onClick?.();
                                    setIsOpen(prev => ({ ...prev, profileDropdown: false }));
                                }}
                                className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                            >
                                <span className="text-xl p-2 rounded-full bg-customGray-100">{data.icon}</span>
                                <p className="text-sm font-medium">{data.text}</p>
                            </div>
                        ))}

                        <TermsAndLinks containerStyle="px-1.5 mt-1.5" />
                    </BasicDropdown>
                </>
            </div>
        </div >
    );
};
