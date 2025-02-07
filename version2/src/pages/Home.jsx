import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import leftbarOptionsData from '@assets/data/home-related/LeftbarOptions.json'

const feedPostingOptions = [
    {
        id: 1,
        title: 'Live video',
        icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg'
    },
    {
        id: 2,
        title: 'Photo/video',
        icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j'
    },
    {
        id: 3,
        title: 'Feeling/activity',
        icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77'
    },
]

const Home = () => {
    return (
        <div className='w-full grid grid-cols-[1fr_2fr_1fr] items-center gap-10 overflow-y-auto'>
            <div className='sticky top-0 w-full h-full p-3 overflow-y-auto'>
                {leftbarOptionsData.map((data) => (
                    <Link
                        to={Routes[data.path].path}
                        className="flex items-center px-3 py-2 gap-2 rounded-lg cursor-pointer hover:bg-slate-100"
                    >
                        <span className="text-xl">{ReactIcons[data.icon]}</span>
                        <p className="font-medium">{data.title}</p>
                    </Link>
                ))}

                <div className="flex items-center px-3 py-2 gap-2 rounded-lg cursor-pointer hover:bg-slate-100">
                    <span className="text-xl">{ReactIcons.DOWN}</span>
                    <p className="font-medium">See more</p>
                </div>

                <div className='terms'>
                    <p className="text-xs whitespace-pre-wrap text-slate-500">
                        <span className="cursor-pointer hover:underline">Privacy</span> · <span className="cursor-pointer hover:underline">Terms</span> · <span className="cursor-pointer hover:underline">Advertising</span> · <span className="cursor-pointer hover:underline">Ad choices</span> · <span className="cursor-pointer hover:underline">Cookies</span> · <span className="cursor-pointer hover:underline">More</span> · <span>Meta © 2023</span>
                    </p>
                </div>
            </div>

            <div className='max-w-[600px] w-full flex flex-col mx-auto'>
                <p>Reels</p>

                <div className="w-full flex flex-col px-4 rounded-lg shadow bg-white">
                    <div className="flex items-center py-3 gap-2">
                        <span className="text-4xl">{ReactIcons.PROFILE_AVATAR}</span>

                        <div className="w-full px-3 py-2.5 rounded-3xl cursor-pointer bg-[#F0F2F5] hover:bg-[#E4E6EB]">
                            <p className="text-slate-500">{`What's on your mind, dumpy`}</p>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100"></div>

                    <div className="grid grid-cols-3 py-2 gap-1">
                        {feedPostingOptions.map((data) => (
                            <div className="flex items-center justify-center p-3 gap-2 rounded-lg cursor-pointer hover:bg-slate-100">
                                <img
                                    src={data.icon}
                                    alt={''}
                                    className="w-5"
                                />
                                <p className="text-sm font-medium text-[#65676B]">Live video</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p>Posts</p>
            </div>

            <div className='sticky top-0 w-full h-full p-3 overflow-y-auto'>
                <div className="flex items-center justify-between border-b border-b-slate-200">
                    <h4 className="font-medium text-[#65676B]">Contacts</h4>

                    <div className="flex items-center">
                        <span className="text-lg p-1.5 rounded-3xl cursor-pointer text-[#65676B] hover:bg-slate-100">{ReactIcons.SEARCH_MAGNIFYINGGLASS}</span>
                        <span className="text-lg p-1.5 rounded-3xl cursor-pointer text-[#65676B] hover:bg-slate-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                    </div>
                </div>

                <div className="flex items-center px-3 py-2 gap-2 rounded-lg cursor-pointer hover:bg-slate-100">
                    <span className="text-xl">{ReactIcons.PROFILE_AVATAR}</span>
                    <p className="font-medium">dumpy friend</p>
                </div>

                <div className="flex items-center justify-between border-b border-b-slate-200">
                    <h4 className="font-medium text-[#65676B]">Group Chats</h4>

                    <span className="text-lg p-1.5 rounded-3xl cursor-pointer text-[#65676B] hover:bg-slate-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>

                <div className="flex items-center px-3 py-2 gap-2 rounded-lg cursor-pointer hover:bg-slate-100">
                    <span className="text-xl">{ReactIcons.ADD_PLUS}</span>
                    <p className="font-medium">Create new group</p>
                </div>
            </div>
        </div>
    )
}

export default Home