import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import leftbarOptionsData from "@assets/data/home-related/LeftbarOptions.json";
import { FeedPost } from "@components/universal/FeedPost";
import { FeedReel } from "@components/universal/FeedReel";

const feedPostingOptions = [
    {
        id: 1,
        title: "Live video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg",
    },
    {
        id: 2,
        title: "Photo/video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j",
    },
    {
        id: 3,
        title: "Feeling/activity",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77",
    },
];

const Home = () => {
    return (
        <div className="grid h-full w-full grid-cols-[1fr_2fr_1fr] gap-10 overflow-y-auto">
            <div className="sticky top-0 flex flex-col gap-2 h-full w-full overflow-y-auto p-2">
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

                <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
                    <div className="flex items-center gap-2 py-3">
                        <span className="text-4xl">
                            {ReactIcons.PROFILE_AVATAR}
                        </span>

                        <div className="w-full cursor-pointer rounded-3xl bg-customGray-default px-3 py-2.5 hover:bg-[#E4E6EB]">
                            <p className="text-slate-500">{`What's on your mind, dumpy`}</p>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-slate-100"></div>

                    <div className="grid grid-cols-3 gap-1 py-2">
                        {feedPostingOptions.map((data) => (
                            <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                                <img src={data.icon} alt={""} className="w-5" />
                                <p className="text-sm font-medium text-[#65676B]">
                                    Live video
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <FeedPost />
            </div>

            <div className="sticky top-0 h-full w-full overflow-y-auto p-2">
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

                    <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-customGray-100">
                        <span className="text-4xl">{ReactIcons.PROFILE_AVATAR}</span>
                        <p className="font-medium">dumpy friend</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center justify-between border-b border-b-slate-300">
                        <h4 className="font-medium text-[#65676B]">Group Chats</h4>

                        <span className="cursor-pointer rounded-3xl p-1.5 text-lg text-[#65676B] hover:bg-slate-100">
                            {ReactIcons.OPTIONS_THREE_DOTS}
                        </span>
                    </div>

                    <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-customGray-100">
                        <span className="text-2xl bg-customGray-100 p-2 rounded-full">{ReactIcons.ADD_PLUS}</span>
                        <p className="font-medium">Create new group</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;