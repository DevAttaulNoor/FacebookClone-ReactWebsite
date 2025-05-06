import { ReactIcons } from "@constants/ReactIcons"

const Profile_Video = ({ userVideosData }) => {
    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline xs:text-xl">Videos</h1>

                <div className="flex items-center">
                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Add videos</p>
                    <span className="text-lg py-2 px-3 rounded-lg ml-1.5 cursor-pointer bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                {userVideosData.map((data) => (
                    <video
                        controls
                        key={data.id}
                        className="max-h-32 h-full w-full shadow object-contain bg-slate-100 xs:max-h-36 sm:max-h-40 md:max-h-44 lg:max-h-48 xl:max-h-52"
                    >
                        <source src={data.media} type="video/mp4" />
                    </video>
                ))}
            </div>
        </div>
    )
}

export default Profile_Video