import { useState } from "react"
import { Link } from "react-router"
import { Routes } from "@constants/Routes"
import { ProfileAvatar } from "../ProfileAvatar"
import { generatePath } from "@utils/PathResolver"
import { timeAgoInitials } from "@utils/TimeModule"
import { DropdownLayout } from "@layouts/DropdownLayout"

export const NotificationsDropdown = ({ dropdownStateData, userData, usersData }) => {
    const [active, setActive] = useState('All');

    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen.notificationDropdown}
            isClose={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, notificationDropdown: false }))}
            dropdownContainerStyle="dropdownContainerStyle1 p-3"
        >
            <h2 className="text-2xl font-semibold">Notification</h2>

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
                {userData?.notifications?.length > 0 ? (
                    <>
                        {userData?.notifications?.map((data, index) => {
                            const notificationRelatedUser = usersData?.find(elem => (elem.uid === data?.uid) || (elem.uid === data?.friendId))

                            return (
                                <div
                                    key={index}
                                    className="flex items-center p-1 gap-2 rounded-md cursor-pointer hover:bg-customGray-default xs:gap-2.5 sm:gap-3"
                                >
                                    <ProfileAvatar
                                        userData={notificationRelatedUser}
                                        imageStyleClass="w-[50px] h-[50px]"
                                        iconStyleClass="text-[50px]"
                                    />

                                    {data?.postId && (
                                        <div className="flex flex-col">
                                            <div className="text-xs sm:text-sm">
                                                <Link
                                                    to={generatePath({ path: Routes.PROFILE.path }, { id: notificationRelatedUser?.uid })}
                                                    className="text-xs font-medium cursor-pointer hover:underline sm:text-sm"
                                                >
                                                    {notificationRelatedUser?.username}
                                                </Link>

                                                {''} has {data?.status} on your post
                                            </div>

                                            <p className="text-[10px] text-customGray-300 sm:text-xs">{timeAgoInitials(data?.timestamp)}</p>
                                        </div>
                                    )}

                                    {data?.friendId && (
                                        <div className="flex flex-col">
                                            <div className="text-xs sm:text-sm">
                                                A friend request has been {data?.status} from

                                                <Link
                                                    to={generatePath({ path: Routes.PROFILE.path }, { id: notificationRelatedUser?.uid })}
                                                    className="text-xs font-medium cursor-pointer hover:underline sm:text-sm"
                                                >
                                                    {''} {notificationRelatedUser?.username}
                                                </Link>
                                            </div>

                                            <p className="text-[10px] text-customGray-300 sm:text-xs">{timeAgoInitials(data?.timestamp)}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <p className="text-center py-2 text-customGray-300">No notifications to be shown</p>
                )}
            </div>
        </DropdownLayout >
    )
}
