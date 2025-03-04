import { ReactIcons } from "@constants/ReactIcons"

export const Profile_Friend = ({ friendsData }) => {
    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline">Friends</h1>

                <div className="flex items-center">
                    <div className='flex items-center p-1.5 mx-1 rounded-3xl bg-customGray-100'>
                        <span className="text-lg ml-1 text-customGray-300">{ReactIcons.SEARCH_MAGNIFYINGGLASS}</span>
                        <input
                            type="text"
                            placeholder='Search Friends'
                            className="w-32 px-1 text-sm text-customGray-300 bg-customGray-100"
                        />
                    </div>

                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Friends requests</p>
                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Find Friends</p>

                    <span className="text-xl py-0.5 px-3 rounded-lg ml-1.5 cursor-pointer bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {friendsData.map((data) => (
                    <div key={data.uid} className="flex items-center justify-between p-2 rounded-lg border border-customGray-100">
                        <div className="flex gap-2 items-center">
                            {data?.profilePhoto ? (
                                <img
                                    src={data.profilePhoto}
                                    alt={`image of ${data.username}`}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            ) : (
                                <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                            )}


                            <p className="text-xs font-medium">{data.username}</p>
                        </div>

                        <span className="p-2 rounded-full cursor-pointer hover:bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}