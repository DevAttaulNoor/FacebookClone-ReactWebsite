import { NavLink } from "react-router";
import { ReactIcons } from "@constants/ReactIcons";

const profileComponents = [
    {
        id: 1,
        title: 'Posts',
        path: ''
    },
    {
        id: 2,
        title: 'About',
        path: ''
    },
    {
        id: 3,
        title: 'Friends',
        path: ''
    },
    {
        id: 4,
        title: 'Photos',
        path: ''
    },
    {
        id: 5,
        title: 'Videos',
        path: ''
    },
]

const Profile = () => {
    return (
        <div className="w-full h-full flex items-center flex-col overflow-y-auto bg">
            <div className="w-full flex flex-col items-center bg-white">
                <div className="flex items-center bg-coverPhoto-gradient">
                    <img
                        src=""
                        alt=""
                        className="w-[1080px] h-[460px] object-cover rounded-lg bg-customGray-default"
                    />
                </div>

                <div className="max-w-[1040px] w-full h-40 flex items-end justify-between px-4 mb-4">
                    <div className="profilePageTop_ProfileSectionLeft">
                        <img
                            src=""
                            alt=""
                            className="w-44 object-cover bottom-1 border-white"
                        />

                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold">User</h3>

                            {/* <NavLink to={`${baseUrl}/${selectedFriend}/friend`}>
                                <p>{friendFriendsData.length} friends</p>
                            </NavLink> */}

                            {/* <div className="flex items-center mt-2">
                                {friendFriendsData.slice(0, 8).map(friends => (
                                    <NavLink to={`${baseUrl}/${selectedFriend}/friend`} key={friends.friendUid}>
                                        <div className="friendPhoto" style={{ marginRight: '-10px' }}>
                                            <Avatar src={friends.photoURL} />
                                        </div>
                                    </NavLink>
                                ))}
                            </div> */}
                        </div>
                    </div>

                    <div className="flex mb-6">
                        <div className="flex items-center px-3 py-2 ml-1 rounded-md cursor-pointer bg-customGray-100">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/r2FA830xjtI.png?_nc_eui2=AeF6jL-mPfHxp3Q2l3_zlRZ1LvJBHXhZHNwu8kEdeFkc3G8XZZMwaO-3gDeqPWuSSoBt_sMKaW0V310y8Er_FfN_" alt="" />
                            <p className="text-sm font-semibold ml-1">Add friend</p>
                        </div>

                        <div className="flex items-center px-3 py-2 ml-1 rounded-md cursor-pointer text-white bg-customBlue-default">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/YjBUcSAL8TC.png?_nc_eui2=AeF2qGdiV5I3eMpACVj57_XQYWMzpYRsku5hYzOlhGyS7gU7w4tIet3x6nGKruTMjeogVqCkMTBSFjIY9O41YKIk" alt="" />
                            <p className="text-sm font-semibold ml-1">Message</p>
                        </div>

                        <div className="flex items-center px-3 py-2 ml-1 rounded-md cursor-pointer bg-customGray-100">
                            {/* <KeyboardArrowDownIcon /> */}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1040px] w-full flex items-center justify-between px-4 border-t border-slate-400">
                    <div className="flex gap-1">
                        {profileComponents.map((data) => (
                            <NavLink
                                key={data.id}
                                to={data.path}
                                className={(({ isActive }) => `${isActive ? 'bg-customGray-100' : ''} text-sm font-semibold p-4 my-0.5 rounded-lg cursor-pointer text-customGray-300 hover:bg-customGray-100`)}
                            >
                                {data.title}
                            </NavLink>
                        ))}

                        <div className="flex items-center px-4 py-3 text-sm font-semibold p-4 my-0.5 rounded-lg cursor-pointer text-customGray-300 bg-customGray-100 gap-0.5">
                            <p>More</p>
                            <span className="text-lg text-customGray-300">{ReactIcons.DOWN}</span>
                        </div>
                    </div>

                    <span className="text-xl cursor-pointer">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="max-w-[1040px] w-full flex items-center px-4">
                Profile page components
                {/* <ProfilepageComponents /> */}
            </div>
        </div>
    );
};

export default Profile;