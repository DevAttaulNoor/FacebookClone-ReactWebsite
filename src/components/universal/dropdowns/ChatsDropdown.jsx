import { Link } from "react-router";
import { useChats } from "@hooks/useChats";
import { ProfileAvatar } from "../ProfileAvatar";
import { SearchBar } from "../searchBar/SearchBar";
import { timeAgoInitials } from "@utils/TimeModule";
import { DropdownLayout } from "@layouts/DropdownLayout";
import { useMessageBox } from "@contexts/MessageBoxContext";

export const ChatsDropdown = ({ dropdownStateData, searchInputStateData, userData, usersData }) => {
    const { setIsMessageBoxOpen } = useMessageBox();
    const { userChats } = useChats(userData?.uid, usersData?.map(data => data.uid));

    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen.messageDropdown}
            isClose={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, messageDropdown: false }))}
            dropdownContainerStyle="dropdownContainerStyle1 p-3"
        >
            <h2 className="text-2xl font-semibold">Chats</h2>

            <SearchBar
                inputStyle={"w-full bg-transparent py-2.5 text-sm"}
                inputData={{
                    type: 'text',
                    value: searchInputStateData.inputValue.chatSearch,
                    placeholder: 'Search Messenger',
                    onChange: (e) => searchInputStateData.setInputValue(prev => ({ ...prev, chatSearch: e.target.value }))
                }}
            />

            <div className='headerOptionDropdownContentStyle'>
                {userChats?.map((data, index) => {
                    const chatUser = usersData?.find(elem => (elem.uid === data.chats[0].senderId) || (elem.uid === data.chats[0].receiverId))

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setIsMessageBoxOpen(chatUser?.id);
                                dropdownStateData.setDropdownOpen(prev => ({ ...prev, messageDropdown: false }));
                            }}
                            className="flex items-center p-1 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                        >
                            <ProfileAvatar
                                userData={chatUser}
                                imageStyleClass="w-12 h-12"
                                iconStyleClass="text-5xl"
                            />

                            <div className="flex flex-col text-sm">
                                <Link
                                    to={`/profile/${chatUser?.uid}`}
                                    onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, messageDropdown: false }))}
                                    className="text-sm font-medium cursor-pointer hover:underline"
                                >
                                    {chatUser?.username}
                                </Link>

                                <p className="text-customGray-300">{data.chats[data.chats.length - 1].message} • {timeAgoInitials(data.timestamp)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </DropdownLayout>
    )
}