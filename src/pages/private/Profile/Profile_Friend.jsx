import { useState } from "react"
import { Link } from "react-router"
import { ReactIcons } from "@constants/ReactIcons"
import { ProfileAvatar } from "@components/universal/ProfileAvatar"
import { SearchBar } from "@components/universal/searchBar/SearchBar"

export const Profile_Friend = ({ friendsData }) => {
    const [serachInput, setSearchInput] = useState('');

    return (
        <div className="w-full p-4 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold cursor-pointer hover:underline">Friends</h1>

                <div className="flex items-center">
                    <SearchBar
                        containerStyle="max-w-36"
                        inputStyle={"w-full bg-transparent py-2.5 text-sm"}
                        inputData={{
                            type: 'text',
                            value: serachInput,
                            placeholder: 'Search Friends',
                            onChange: (e) => setSearchInput(e.target.value)
                        }}
                    />

                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Friends requests</p>
                    <p className="text-sm font-medium p-2 mx-1 rounded text-customBlue-default cursor-pointer hover:bg-customGray-100">Find Friends</p>

                    <span className="text-lg py-2 px-3 rounded-lg ml-1.5 cursor-pointer bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {friendsData.map((data) => (
                    <Link
                        key={data.uid}
                        to={`/profile/${data.uid}`}
                        className="flex items-center justify-between p-2 rounded-lg border border-customGray-100"
                    >
                        <div className="flex gap-2 items-center">
                            <ProfileAvatar
                                userData={data}
                                imageStyleClass="w-16 h-16"
                                iconStyleClass="text-[64px]"
                            />

                            <p className="text-sm font-medium">{data.username}</p>
                        </div>

                        <span className="p-2 rounded-full cursor-pointer hover:bg-customGray-100">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}