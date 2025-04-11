import { Link, NavLink, useLocation, useParams } from "react-router";
import { useGroups } from "@hooks/useGroups"
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import Group_About from "./Group_About";
import Group_Media from "./Group_Media";
import Group_People from "./Group_People";

const Group = () => {
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const { groups } = useGroups();
    const activeGroup = groups?.find(data => data.id === id);
    const groupsJoined = groups?.filter(data => data.adminId === user?.uid || data.members?.some(mem => mem === user?.uid));

    const groupComponents = [
        { id: 1, title: 'About', path: `/group/${id}/about` },
        { id: 2, title: 'Discussion', path: `/group/${id}` },
        { id: 3, title: 'People', path: `/group/${id}/people` },
        { id: 4, title: 'Media', path: `/group/${id}/media` },
    ];

    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                {/* Cover Photo */}
                <div className="w-[1080px] h-[460px] rounded-b-lg bg-coverPhoto-gradient">
                    <div
                        style={{ backgroundImage: `url(${activeGroup?.coverPhoto})` }}
                        className="w-full h-full flex items-end justify-end py-4 px-6 rounded-b-lg bg-cover bg-center bg-no-repeat bg-customGray-default"
                    >
                        {activeGroup?.adminId === user?.uid && (
                            <button
                                onClick={() => coverPhotoRef.current.click()}
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-white hover:bg-customGray-default z-[5]"
                            >
                                <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>
                                <p className="text-sm font-semibold">Edit</p>

                                {/* <input
                                    type="file"
                                    ref={coverPhotoRef}
                                    accept="image/*"
                                    onChange={() => handlePhotoChange('coverPhoto', coverPhotoRef)}
                                    className="hidden"
                                /> */}
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="max-w-[1040px] w-full flex items-end justify-between p-4">
                    <div className='flex flex-col'>
                        <h3 className="text-[28px] font-bold">{activeGroup?.name}</h3>

                        {/* Members Count */}
                        <div className="w-fit text-sm font-medium text-customGray-300 cursor-pointer hover:underline">
                            {`${activeGroup?.members?.length} ${activeGroup?.members?.length > 1 ? 'members' : 'member'}`}
                        </div>

                        {/* Members List Preview */}
                        <div className="flex items-center">
                            {activeGroup?.members?.slice(0, 8).map((data) => (
                                <Link
                                    key={data}
                                    to={`/profile/${data}`}
                                    className="rounded-full border-2 border-white -ml-2 first:-ml-0"
                                >
                                    <ProfileAvatar
                                        userData={data}
                                        imageStyleClass="w-8 h-8"
                                        iconStyleClass="text-2xl"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {groupsJoined ? (
                            <button
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                            >
                                <span className="text-lg">{ReactIcons.GROUP}</span>
                                <p className="text-sm font-semibold">Joined</p>
                            </button>
                        ) : (
                            <button
                                className="flex items-center px-3 py-2 gap-1 rounded-md cursor-pointer bg-customGray-100"
                            >
                                <span className="text-lg">{ReactIcons.GROUP}</span>
                                <p className="text-sm font-semibold">Leave</p>
                            </button>
                        )}
                    </div>
                </div>

                {/* Group Components Navigation */}
                <div className="max-w-[1040px] w-full flex items-center justify-between px-4 border-t border-slate-400">
                    <div className="flex gap-1">
                        {groupComponents.map((data) => (
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

                    <span className="text-xl cursor-pointer">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            {/* Group Page Components */}
            <div className="max-w-[1040px] w-full flex p-4 gap-4">
                {location.pathname === `/group/${id}` && (
                    <>
                        Group Discussions
                    </>
                )}

                {location.pathname === `/group/${id}/about` && (
                    <Group_About />
                )}

                {location.pathname === `/group/${id}/people` && (
                    <Group_People />
                )}

                {location.pathname === `/group/${id}/media` && (
                    <Group_Media />
                )}
            </div>
        </div>
    )
}

export default Group