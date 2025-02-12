import { ReactIcons } from "@constants/ReactIcons";

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

const Post = () => {
    return (
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
    );
};

export default Post;
