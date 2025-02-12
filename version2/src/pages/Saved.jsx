import { NavLink } from "react-router";
import { Routes } from "@constants/Routes";
import { ReactIcons } from "@constants/ReactIcons";
import userData from "@assets/data/universal/Users.json"

const Saved = () => {
    return (
        <div className='w-full h-full flex overflow-hidden'>
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between pl-2 mb-2">
                    <p className="text-xl font-bold">Saved</p>

                    <span className="text-xl p-1.5 rounded-full bg-customGray-100 cursor-pointer hover:bg-slate-200">{ReactIcons.SETTING}</span>
                </div>

                <NavLink
                    end
                    to={Routes.SAVED.path}
                    className={({ isActive }) => `${isActive ? "bg-customGray-default" : "hover:bg-customGray-default"} flex items-center justify-between p-2 rounded-lg cursor-pointer`}>
                    <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 rounded-full bg-customGray-100">{ReactIcons.SAVED}</span>
                        <p className="font-medium">Saved items</p>
                    </div>
                </NavLink>
            </div>

            <div className='w-full flex flex-col px-16 py-4 gap-4 overflow-y-auto'>
                <h1 className="text-xl font-bold">All</h1>

                <div className='w-full h-40 flex p-3 gap-4 rounded-md shadow-customFull2 bg-white'>
                    <img
                        src={userData[0].profilephoto}
                        alt={`image of ${userData[0].name}`}
                        className="w-36 cursor-pointer object-cover rounded-md"
                    />

                    <div className='flex flex-col justify-between'>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold cursor-pointer hover:underline">message</h3>

                            <div className='flex items-center gap-1'>
                                <img
                                    src={userData[0].profilephoto}
                                    alt={`image of ${userData[0].name}`}
                                    className="w-6 h-6 rounded-full object-cover cursor-pointer"
                                />

                                <p className="text-xs text-customGray-300">Saved from</p>
                                <span className="text-xs font-medium cursor-pointer hover:underline">{userData[0].name}'s post</span>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <button className="text-sm font-medium flex items-center justify-center py-2 px-8 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">Add to collection</button>

                            <span className="flex items-center justify-center text-xl px-2 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Saved;