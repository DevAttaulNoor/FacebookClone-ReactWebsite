import { ReactIcons } from "@constants/ReactIcons"

export const Profile_Video = () => {
    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline">Videos</h1>

                <div className="flex items-center">
                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Add videos</p>
                    <span className="text-xl py-0.5 px-3 rounded-lg ml-1.5 cursor-pointer bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {/* <video controls>
                    <source src={url} type="video/mp4" />
                </video> */}
            </div>
        </div>
    )
}