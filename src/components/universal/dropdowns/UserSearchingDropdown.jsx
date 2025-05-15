import { Link } from 'react-router'
import { ProfileAvatar } from '../ProfileAvatar'
import { InputField } from '../inputs/InputField'
import { ReactIcons } from '@constants/ReactIcons'
import { DropdownLayout } from '@layouts/DropdownLayout'

export const UserSearchingDropdown = ({ dropdownStateData, inputStateData, usersData }) => {
    const searchedUser = usersData?.filter((data) => data?.username?.toLowerCase().includes(inputStateData.inputValue.userSearch.toLowerCase()));

    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen.userSearchDropdown}
            isClose={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, userSearchDropdown: false }))}
            dropdownContainerStyle="dropdownContainerStyle1 top-0 -left-[10px] max-h-96 shadow-xl z-10"
        >
            <div className="flex items-center gap-2">
                <span
                    onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, userSearchDropdown: false }))}
                    className="text-xl p-2.5 rounded-full cursor-pointer bg-customGray-default hover:bg-customGray-100"
                >
                    {ReactIcons.ARROW_LEFT}
                </span>

                <div className="flex w-full max-w-64 items-center gap-1.5 rounded-3xl bg-customGray-default px-3">
                    <span className="text-customGray-200">
                        {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                    </span>

                    <InputField
                        inputStyle="w-full bg-transparent py-2.5 text-sm"
                        inputData={{
                            type: 'text',
                            value: inputStateData.inputValue.userSearch,
                            placeholder: 'Search Facebook',
                            onChange: (e) => inputStateData.setInputValue(prev => ({ ...prev, userSearch: e.target.value }))
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto">
                {searchedUser?.length > 0 ? (
                    <>
                        {searchedUser?.map(data => (
                            <Link
                                key={data?.uid}
                                to={`/profile/${data?.uid}`}
                                onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, userSearchDropdown: false }))}
                                className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                            >
                                <ProfileAvatar
                                    userData={data}
                                    imageStyleClass="w-9 h-9"
                                    iconStyleClass="flex items-center justify-center text-xl p-2 rounded-full bg-customGray-100"
                                />

                                <p className="text-sm font-medium">{data?.username}</p>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="text-center py-2 text-customGray-300">No match found</p>
                )}
            </div>
        </DropdownLayout>
    )
}
