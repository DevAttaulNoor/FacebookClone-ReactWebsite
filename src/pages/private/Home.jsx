import { useState } from "react";
import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useReels } from "@hooks/useReels";
import { SvgIcons } from "@constants/SvgIcons";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { FeedPost } from "@components/universal/feed-related/FeedPost";
import { FeedStory } from "@components/universal/feed-related/FeedStory";
import { MessageBox } from "@components/universal/message-related/MessageBox";
import { FeedPostPosting } from "@components/universal/feed-related/FeedPostPosting";

const Home = () => {
    const { user } = useAuth();
    const { posts } = usePosts();
    const { users } = useUsers();
    const { reels } = useReels();
    const { acceptedFriends } = useFriends(user.uid);
    const [isMessageBoxVisible, setIsMessageBoxVisisble] = useState(null);

    const leftbarOptionsData = [
        {
            id: 1,
            icon: ReactIcons.FRIEND,
            title: Routes.FRIEND.title,
            path: Routes.FRIEND.path,
        },
        {
            id: 2,
            icon: ReactIcons.VIDEO,
            title: Routes.VIDEO.title,
            path: Routes.VIDEO.path,
        },
        {
            id: 3,
            icon: SvgIcons.SAVED({ styleClass: 'w-[28px] h-[28px]' }),
            title: Routes.SAVED.title,
            path: Routes.SAVED.path,
        },
        {
            id: 4,
            icon: SvgIcons.FEED({ styleClass: 'w-[30px] h-[30px]' }),
            title: Routes.FEED.title,
            path: Routes.FEED.path,
        },
        {
            id: 5,
            icon: SvgIcons.REEL({ styleClass: 'w-[30px] h-[30px]' }),
            title: Routes.REEL.title,
            path: `/reel/${reels[reels.length - 1]?.id}`,
        },
        {
            id: 6,
            icon: ReactIcons.GROUP,
            title: Routes.GROUP_CREATE.title,
            path: Routes.GROUP_CREATE.path,
        }
    ];

    return (
        <div className="grid h-full w-full grid-cols-[1fr_2fr_1fr] gap-10 overflow-y-auto">
            <div className="flex flex-col gap-1 h-full w-full overflow-y-auto p-2">
                <Link
                    to={`/profile/${user.uid}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 hover:bg-customGray-100"
                >
                    <ProfileAvatar
                        userData={user}
                        imageStyleClass='w-9 h-9'
                        iconStyleClass='text-3xl p-1'
                    />

                    <p className="font-medium">{user?.username}</p>
                </Link>

                {leftbarOptionsData.map((data) => (
                    <Link
                        key={data.id}
                        to={data.path}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 hover:bg-customGray-100"
                    >
                        <span className="p-1 text-3xl">{data.icon}</span>
                        <p className="font-medium">{data.title}</p>
                    </Link>
                ))}

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
                <FeedStory />

                <FeedPostPosting />

                <FeedPost
                    activeUser={user}
                    userData={users}
                    postData={posts}
                />
            </div>

            <div className="h-full w-full flex flex-col p-2 gap-2 overflow-y-auto">
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
                    <div
                        key={user.uid}
                        onClick={() => setIsMessageBoxVisisble(user.uid)}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 hover:bg-customGray-100"
                    >
                        <ProfileAvatar
                            userData={user}
                            imageStyleClass="w-10 h-10"
                            iconStyleClass="text-3xl"
                        />

                        <p className="font-medium">{user.username}</p>
                    </div>
                ))}

                {isMessageBoxVisible && <MessageBox isOpen={isMessageBoxVisible} isClose={() => setIsMessageBoxVisisble(null)} />}
            </div>
        </div>
    );
};

export default Home;