import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useFriends } from "@hooks/useFriends";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { FeedPost } from "@components/universal/FeedPost";
import { FeedReel } from "@components/universal/FeedReel";
import { FeedPostPosting } from "@components/universal/FeedPostPosting";
import leftbarOptionsData from "@assets/data/home-related/LeftbarOptions.json";

const Home = () => {
    const user = useAuthUser();
    const { posts } = usePosts();
    const { users } = useUsers();
    const { acceptedFriends } = useFriends(user.uid);

    return (
        <div className="grid h-full w-full grid-cols-[1fr_2fr_1fr] gap-10 overflow-y-auto">
            <div className="flex flex-col gap-2 h-full w-full overflow-y-auto p-2">
                <Link
                    to={Routes.PROFILE.path}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-customGray-100"
                >
                    {user ? (
                        <>
                            {user?.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt={`profile picture of ${user.username}`}
                                    className="w-8 h-8 rounded-full border border-customGray-100 object-contain bg-white"
                                />
                            ) : (
                                <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                            )}
                            <p className="font-medium">{user.username}</p>
                        </>
                    ) : (
                        <>
                            <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                            <p className="font-medium">Profile name</p>
                        </>
                    )}
                </Link>

                {leftbarOptionsData.map((data) => (
                    <Link
                        key={data.id}
                        to={Routes[data.path].path}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-customGray-100"
                    >
                        <span className="text-3xl">{ReactIcons[data.icon]}</span>
                        <p className="font-medium">{data.title}</p>
                    </Link>
                ))}

                <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-customGray-100">
                    <span className="text-3xl">{ReactIcons.DOWN}</span>
                    <p className="font-medium">See more</p>
                </div>

                <p className="whitespace-pre-wrap text-xs px-3 text-slate-500">
                    <span className="cursor-pointer hover:underline">
                        Privacy
                    </span>{" "}
                    ·{" "}
                    <span className="cursor-pointer hover:underline">
                        Terms
                    </span>{" "}
                    ·{" "}
                    <span className="cursor-pointer hover:underline">
                        Advertising
                    </span>{" "}
                    ·{" "}
                    <span className="cursor-pointer hover:underline">
                        Ad choices
                    </span>{" "}
                    ·{" "}
                    <span className="cursor-pointer hover:underline">
                        Cookies
                    </span>{" "}
                    ·{" "}
                    <span className="cursor-pointer hover:underline">
                        More
                    </span>{" "}
                    · <span>Meta © 2023</span>
                </p>
            </div>

            <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4 py-4">
                <FeedReel />

                <FeedPostPosting />

                <FeedPost
                    userData={users}
                    postData={posts}
                />
            </div>

            <div className="h-full w-full overflow-y-auto p-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-b-slate-300">
                        <h4 className="font-medium text-[#65676B]">Contacts</h4>

                        <div className="flex items-center">
                            <span className="cursor-pointer rounded-3xl p-1.5 text-lg text-[#65676B] hover:bg-slate-100">
                                {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                            </span>
                            <span className="cursor-pointer rounded-3xl p-1.5 text-lg text-[#65676B] hover:bg-slate-100">
                                {ReactIcons.OPTIONS_THREE_DOTS}
                            </span>
                        </div>
                    </div>

                    {acceptedFriends.map((user) => (
                        <div key={user.uid} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 hover:bg-customGray-100">
                            {user?.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt={`profile picture of ${user.username}`}
                                    className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                />
                            ) : (
                                <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                            )}
                            <p className="font-medium">{user.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;