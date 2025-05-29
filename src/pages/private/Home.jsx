import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { usePosts } from "@hooks/usePosts";
import { useUsers } from "@hooks/useUsers";
import { useReels } from "@hooks/useReels";
import { SvgIcons } from "@constants/SvgIcons";
import { useFriends } from "@hooks/useFriends";
import { useStories } from "@hooks/useStories";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { useMessageBox } from "@contexts/MessageBoxContext";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { TermsAndLinks } from "@components/universal/TermsAndLinks";
import { HomeLeftbarContentLayout } from "@layouts/HomeLeftbarContentLayout";
import { StoryPostFeed } from "@components/universal/feed-related/StoryPostFeed";
import { PostingRegularPost } from "@components/universal/post-related/PostingRegularPost";
import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed";

const Home = () => {
    const { user } = useAuth();
    const { posts } = usePosts();
    const { users } = useUsers();
    const { reels } = useReels();
    const { setIsMessageBoxOpen } = useMessageBox();
    const { acceptedFriends } = useFriends(user.uid);
    const { stories, userStories } = useStories(user?.uid);
    const friendsPosts = posts?.filter(data => (data.uid === user?.uid) || (acceptedFriends?.some(friend => friend.uid === data.uid)));
    const friendsPhotoPosts = friendsPosts?.filter(data => data.mediaType === 'image');
    const userRelatedStories = stories?.filter(data => acceptedFriends.some(friend => friend.uid === data.uid)).concat(userStories);

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
            title: Routes.GROUP.title,
            path: Routes.GROUP_FEED.path,
        }
    ];

    return (
        <div className="relative w-full grid grid-cols-[1fr] gap-8 overflow-y-auto md:grid-cols-[2fr_1fr] lg:grid-cols-[1fr_2fr_1fr]">
            <div className="hidden homeSidebarStyle lg:flex">
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

                <TermsAndLinks containerStyle="px-3" />
            </div>

            <div className="feedPostWidth flex flex-col p-4 mx-auto gap-4">
                <StoryPostFeed
                    userData={user}
                    usersData={users}
                    userRelatedStoriesData={userRelatedStories}
                />

                <PostingRegularPost
                    userData={user}
                />

                <RegularPostFeed
                    userData={user}
                    usersData={users}
                    postsData={friendsPhotoPosts}
                />
            </div>

            <div className="hidden homeSidebarStyle md:flex">
                <HomeLeftbarContentLayout title={'Contacts'}>
                    <div className="flex flex-col gap-1.5">
                        {acceptedFriends?.map(user => (
                            <div
                                key={user?.uid}
                                onClick={() => setIsMessageBoxOpen(user?.uid)}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 hover:bg-customGray-100"
                            >
                                <ProfileAvatar
                                    userData={user}
                                    imageStyleClass="w-[42px] h-[42px]"
                                    iconStyleClass="text-[42px]"
                                />

                                <p className="font-medium">{user?.username}</p>
                            </div>
                        ))}
                    </div>
                </HomeLeftbarContentLayout>
            </div>
        </div>
    );
};

export default Home;