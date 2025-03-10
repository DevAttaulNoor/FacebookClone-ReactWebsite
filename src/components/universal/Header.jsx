import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import { useAuthUser } from "@hooks/useAuthUser";
import { InputField } from "./inputs/InputField";
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
    }
];

export const Header = () => {
    const user = useAuthUser();
    const [inputValue, setInputValue] = useState({
        userSearch: '',
        chatSearch: ''
    });
    const [isOpen, setIsOpen] = useState({
        userSearchDropdown: false,
        profileDropdown: false,
        messageDropdown: false,
        notificationDropdown: false,
    });
    const [active, setActive] = useState('All');

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
                    dropdownContainerStyle="dropdownContainerStyle1 top-0 -left-[10px] shadow-xl"
                >
                    <div className="flex items-center gap-2 p-1">
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

                    <div className="searchBoxBottom">
                        {/* {matchingUsernames.length > 0 ? (
                            matchingUsernames.map((matchingUser) => (
                                <div className='searchBoxBottomOption' key={matchingUser.id} onClick={() => handleSearchBoxVisibility()}>
                                    <NavLink to={`/profilepage/${matchingUser.id}/post`} onClick={() => dispatch(setSelectedFriend(matchingUser.id))}>
                                        <Avatar src={matchingUser.photoURL} />
                                        <p>{matchingUser.username}</p>
                                    </NavLink>
                                </div>
                            ))
                        ) : (
                            <p id='noMatch'>No match found</p>
                        )} */}
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
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt={`profile picture of ${user.username}`}
                            className="w-11 h-11 rounded-full border border-customGray-100 object-contain bg-white"
                        />
                    ) : (
                        <span className="flex items-center justify-center rounded-full bg-customGray-100 p-2.5 text-2xl">
                            {ReactIcons.PROFILE_AVATAR}
                        </span>
                    )}
                </button>

                <>
                    <BasicDropdown
                        isOpen={isOpen.messageDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, messageDropdown: false }))}
                        dropdownData={{ title: 'Chats' }}
                        dropdownContainerStyle="dropdownContainerStyle1"
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

                        {/* <div className='messageBoxBottomOption' onClick={() => handleMsgFriendBox(friend[0])}>
                            <Avatar src={isUserSender ? chat.recipientPhotoUrl : chat.senderPhotoUrl} />
                            <div className='messageBoxBottomOptionContent'>
                                <p>{isUserSender ? chat.recipientName : chat.senderName}</p>
                                <div className='messageBoxBottomOptionContentBottom'>
                                    <span>{lastMessage.text}</span>
                                    <p> · </p>
                                    <h5>{timeAgoInitials(lastMessage.timestamp)}</h5>
                                </div>
                            </div>
                        </div> */}
                    </BasicDropdown>

                    <BasicDropdown
                        isOpen={isOpen.notificationDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, notificationDropdown: false }))}
                        dropdownData={{ title: 'Notification' }}
                        dropdownContainerStyle="dropdownContainerStyle1"
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

                        <div className='notificationBoxBottom'>
                            {/* {active === 'All' && (
                                <div className='notificationBoxBottomOptions'>
                                    {notification.map((notification, index) => (
                                        <div key={index}>
                                            {notification.status === 'reacted' && (
                                                <div className='notificationBoxBottomOption'>
                                                    <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Likes")}>
                                                        <div className='notificationBoxBottomOption_Left'>
                                                            <Avatar src={notification.userphotoUrl} />
                                                        </div>
                                                        <div className="notificationBoxBottomOption_Right">
                                                            <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                            <h5>{timeAgo(notification.timestamp)}</h5>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            )}

                                            {notification.status === 'commented' && (
                                                <div className='notificationBoxBottomOption'>
                                                    <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Comments")}>
                                                        <div className='notificationBoxBottomOption_Left'>
                                                            <Avatar src={notification.userphotoUrl} />
                                                        </div>
                                                        <div className="notificationBoxBottomOption_Right">
                                                            <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                            <h5>{timeAgo(notification.timestamp)}</h5>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            )}

                                            {(notification.status === 'sent' || notification.status === 'accepted' || notification.status === 'removed') && (
                                                <div className='notificationBoxBottomOption'>
                                                    <NavLink to={`/friendpage/friendReqs`} onClick={() => handleNotificationClicked(notification.requestId, "FriendsReqs")}>
                                                        <div className='notificationBoxBottomOption_Left'>
                                                            <Avatar src={notification.senderPhotoUrl} />
                                                        </div>
                                                        <div className="notificationBoxBottomOption_Right">
                                                            <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                            <h5>{timeAgo(notification.timestamp)}</h5>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {active === 'Unread' && (
                                <div className='notificationBoxBottomOptions'>
                                    {notification
                                        .filter(notification => notification.notificationStatus === 'notseen')
                                        .map((notification, index) => (
                                            <div key={index}>
                                                {notification.status === 'reacted' && (
                                                    <div className='notificationBoxBottomOption'>
                                                        <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Likes")}>
                                                            <div className='notificationBoxBottomOption_Left'>
                                                                <Avatar src={notification.userphotoUrl} />
                                                            </div>
                                                            <div className="notificationBoxBottomOption_Right">
                                                                <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                                <h5>{timeAgo(notification.timestamp)}</h5>
                                                            </div>
                                                        </NavLink>
                                                    </div>
                                                )}

                                                {notification.status === 'commented' && (
                                                    <div className='notificationBoxBottomOption'>
                                                        <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => handleNotificationClicked(notification.postid, "Comments")}>
                                                            <div className='notificationBoxBottomOption_Left'>
                                                                <Avatar src={notification.userphotoUrl} />
                                                            </div>
                                                            <div className="notificationBoxBottomOption_Right">
                                                                <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                                <h5>{timeAgo(notification.timestamp)}</h5>
                                                            </div>
                                                        </NavLink>
                                                    </div>
                                                )}

                                                {notification.status === 'sent' && (
                                                    <div className='notificationBoxBottomOption'>
                                                        <NavLink to={`/friendpage/friendReqs`} onClick={() => handleNotificationClicked(notification.requestId, "FriendsReqs")}>
                                                            <div className='notificationBoxBottomOption_Left'>
                                                                <Avatar src={notification.senderPhotoUrl} />
                                                            </div>
                                                            <div className="notificationBoxBottomOption_Right">
                                                                <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                                <h5>{timeAgo(notification.timestamp)}</h5>
                                                            </div>
                                                        </NavLink>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )} */}
                        </div>
                    </BasicDropdown>

                    <BasicDropdown
                        isOpen={isOpen.profileDropdown}
                        isClose={() => setIsOpen(prev => ({ ...prev, profileDropdown: false }))}
                        dropdownContainerStyle="dropdownContainerStyle1 gap-1"
                    >
                        <Link
                            to={Routes.PROFILE.path}
                            className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                        >
                            {user.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt={`profile picture of ${user.username}`}
                                    className="w-9 h-9 rounded-full border border-customGray-100 object-contain bg-white"
                                />
                            ) : (
                                <span className="text-xl p-2 rounded-full bg-customGray-100">
                                    {ReactIcons.PROFILE_AVATAR}
                                </span>
                            )}

                            <p className="text-sm font-medium">{user.username}</p>
                        </Link>

                        {profileDropdownOptions.map((data) => (
                            <div
                                key={data.id}
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
        </div >
    );
};
