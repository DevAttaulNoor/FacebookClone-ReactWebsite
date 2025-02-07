import React from 'react'
import { Link, NavLink } from 'react-router';
import { Routes } from '@constants/Routes';
import { ReactIcons } from '@constants/ReactIcons';
import fblogo from '/Images/fblogo.png'

const headerLinks = [
    {
        id: 1,
        title: Routes.HOME.title,
        path: Routes.HOME.path,
        ActiveIcon: ReactIcons.HOME,
        nonActiveIcon: ReactIcons.HOME_OUTLINED
    },
    {
        id: 2,
        title: Routes.FRIEND.title,
        path: Routes.FRIEND.path,
        ActiveIcon: ReactIcons.FRIEND,
        nonActiveIcon: ReactIcons.FRIEND_OUTLINED
    },
    {
        id: 3,
        title: Routes.VIDEO.title,
        path: Routes.VIDEO.path,
        ActiveIcon: ReactIcons.VIDEO,
        nonActiveIcon: ReactIcons.VIDEO_OUTLINED
    },
    {
        id: 4,
        title: Routes.GROUP.title,
        path: Routes.GROUP.path,
        ActiveIcon: ReactIcons.GROUP,
        nonActiveIcon: ReactIcons.GROUP_OUTLINED
    },
]

const headerSideOptions = [
    {
        id: 1,
        title: 'Menu',
        icon: ReactIcons.MENU,
    },
    {
        id: 2,
        title: 'Message',
        icon: ReactIcons.MESSAGE,
    },
    {
        id: 3,
        title: 'Notification',
        icon: ReactIcons.NOTIFICATION,
    },
    {
        id: 4,
        title: 'Profile',
        icon: ReactIcons.PROFILE_AVATAR,
    }
]

export const Header = () => {
    return (
        <div className='sticky top-0 grid grid-cols-[1fr_2fr_1fr] px-3 shadow z-30 bg-white'>
            <div className='flex py-2 gap-2'>
                <Link
                    to={Routes.HOME.path}
                    className='w-11 h-11'
                >
                    <img
                        src={fblogo}
                        alt="logo of facebook"
                        className='w-full h-full'
                    />
                </Link>

                <div className='max-w-64 w-full flex items-center justify-between gap-2 px-2.5 rounded-3xl bg-[#F0F2F5]'>
                    <span className='text-lg text-slate-600'>{ReactIcons.SEARCH_MAGNIFYINGGLASS}</span>

                    <input
                        type="text"
                        placeholder='Search Facebook'
                        className='w-full text-sm py-2 outline-none bg-transparent'
                    />
                </div>
            </div>

            <div className="flex justify-center py-1 gap-2">
                {headerLinks.map((data) => (
                    <NavLink
                        key={data.id}
                        to={data.path}
                        title={data.title}
                        className={({ isActive }) => `${isActive ? 'before:absolute before:left-0 before:right-0 before:-bottom-1 before:h-[2px] before:bg-[#2381fa]' : 'hover:bg-slate-100'} relative flex items-center px-12 rounded-lg cursor-pointer`}
                    >
                        {({ isActive }) => (isActive ? (
                            <span className='text-2xl text-[#2381fa]'>{data.ActiveIcon}</span>
                        ) : (
                            <span className='text-2xl text-[#65676B]'>{data.nonActiveIcon}</span>
                        ))}
                    </NavLink>
                ))}
            </div>

            <div className='flex items-center justify-end py-2 gap-2'>
                {headerSideOptions.map((data) => (
                    <span title={data.title} className='flex items-center justify-center text-2xl p-2.5 rounded-full cursor-pointer bg-[#E4E6EB]'>
                        {data.icon}
                    </span>
                ))}
            </div>
        </div>
    )
}