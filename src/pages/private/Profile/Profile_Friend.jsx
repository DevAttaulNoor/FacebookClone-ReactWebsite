import { useState } from "react"
import { Link } from "react-router"
import { ReactIcons } from "@constants/ReactIcons"
import { ProfileAvatar } from "@components/universal/ProfileAvatar"
import { SearchBar } from "@components/universal/searchBar/SearchBar"

const Profile_Friend = ({ friendsData }) => {
    const [serachInput, setSearchInput] = useState('');

    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline xs:text-xl">Friends</h1>

                <div className="flex items-center">
                    <SearchBar
                        containerStyle="max-w-32 sm:max-w-36"
                        inputStyle={"w-full bg-transparent py-2 text-xs sm:text-sm sm:py-2.5"}
                        inputData={{
                            type: 'text',
                            value: serachInput,
                            placeholder: 'Search Friends',
                            onChange: (e) => setSearchInput(e.target.value)
                        }}
                    />

                    <p className="hidden text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-default sm:block">Friends requests</p>
                    <p className="hidden text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-default md:block">Find Friends</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3 md:gap-3">
                {friendsData.map((data) => (
                    <Link
                        key={data.uid}
                        to={`/profile/${data.uid}`}
                        className="flex items-center justify-between p-1 rounded-lg border shadow-sm border-customGray-100 xs:p-1.5 sm:p-2"
                    >
                        <div className="flex gap-1.5 items-center sm:gap-2">
                            <ProfileAvatar
                                userData={data}
                                imageStyleClass="w-12 h-12 xs:w-[52px] xs:h-[52px] sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] xl:w-16 xl:h-16"
                                iconStyleClass="text-[64px]"
                            />

                            <p className="text-xs font-medium sm:text-sm">{data.username}</p>
                        </div>

                        <span className="text-sm p-1 rounded-full cursor-pointer hover:bg-customGray-default xs:p-1.5 sm:text-base sm:p-2">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Profile_Friend