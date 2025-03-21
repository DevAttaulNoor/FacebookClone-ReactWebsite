import { useState } from "react";
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@services/firebase";
import { useUsers } from "@hooks/useUsers";
import { useChats } from "@hooks/useChats";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "../ProfileAvatar";
import { InputField } from "../inputs/InputField";

export const MessageBox = ({ isOpen, isClose }) => {
    const { user } = useAuthUser();
    const { chats } = useChats();
    const { usersExceptCurrent } = useUsers(user?.uid);
    const [searchInput, setSearchInput] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const searchedUser = usersExceptCurrent?.filter((data) => data?.username?.toLowerCase().includes(searchInput.toLowerCase()));
    const selectedUserData = usersExceptCurrent?.find((data) => (data?.uid === isOpen) || (data?.uid === selectedUser));
    const selectedUserChats = chats?.find((data) => (data.id === `${user?.uid}${selectedUserData?.uid}`) || (data.id === `${selectedUserData?.uid}${user?.uid}`));

    const handleMessaging = async (userId, friendId, messageInput) => {
        try {
            const chatId = userId < friendId ? `${userId}${friendId}` : `${friendId}${userId}`;
            const chatRef = doc(collection(db, "Chats"), chatId);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
                await updateDoc(chatRef, {
                    chats: arrayUnion({
                        senderId: userId,
                        receiverId: friendId,
                        message: messageInput,
                        timestamp: Math.floor(new Date().getTime() / 1000),
                    }),
                });
                setMessageInput('');
            } else {
                await setDoc(chatRef, {
                    uids: chatId,
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    chats: [{
                        senderId: userId,
                        receiverId: friendId,
                        message: messageInput,
                        timestamp: Math.floor(new Date().getTime() / 1000),
                    }],
                });
                setMessageInput('');
            }
        } catch (error) {
            console.error("Unsuccessful", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (messageInput.trim()) {
                handleMessaging(user?.uid, selectedUserData?.uid, messageInput);
            }
        }
    };

    return (
        <div className='absolute bottom-0 right-36 w-80 h-96 flex flex-col rounded-t-md shadow-customFull2 bg-white'>
            <div className={`${isOpen ? 'border-b' : 'pb-0'} flex items-center justify-between p-3`}>
                {isOpen ? (
                    <h5 className="text-sm font-medium">{selectedUserData?.username}</h5>
                ) : (
                    <h5 className="text-sm font-medium">New message</h5>
                )}

                <span
                    onClick={isClose}
                    className="text-xl p-0.5 rounded-full cursor-pointer text-customGray-300 hover:bg-customGray-default"
                >
                    {ReactIcons.CLOSE}
                </span>
            </div>

            {!isOpen && (
                <div className='flex p-3 gap-3 border-b'>
                    <p className="text-sm">To: </p>

                    {selectedUserData ? (
                        <div className="flex items-center p-2 gap-2 rounded-md text-customBlue-default bg-customGray-100">
                            <p className="text-xs font-medium">{selectedUserData?.username}</p>

                            <span
                                onClick={() => { setSelectedUser(''), setSearchInput('') }}
                                className="text-sm cursor-pointer"
                            >
                                {ReactIcons.CLOSE}
                            </span>
                        </div>
                    ) : (
                        <InputField
                            inputData={{
                                type: 'text',
                                value: searchInput,
                                onChange: (e) => setSearchInput(e.target.value),
                            }}
                            inputStyle="w-full text-sm"
                        />
                    )}
                </div>
            )}

            {selectedUser || isOpen ? (
                <div className="h-full flex flex-col justify-between">
                    <div className={`${isOpen ? 'h-72' : 'h-60'} flex flex-col overflow-y-auto`}>
                        <div className="flex flex-col items-center justify-center py-4 px-3 gap-1">
                            <ProfileAvatar
                                userData={selectedUserData}
                                imageStyleClass="w-16 h-16"
                                iconStyleClass="text-[64px]"
                            />

                            <p className="text-sm font-medium">{selectedUserData?.username}</p>
                            {selectedUserData?.bio && <p className="text-sm font-medium">{selectedUserData?.bio}</p>}
                        </div>

                        <div className="flex flex-col gap-2 px-3 py-2">
                            {selectedUserChats?.chats?.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`${chat.senderId === user?.uid ? 'self-end items-end' : 'self-start items-start'} flex flex-col`}
                                >
                                    <span className={`${chat.senderId === user?.uid ? 'text-white bg-customBlue-300' : 'bg-customGray-100'} w-fit px-3 py-2 text-sm rounded-xl`}>{chat.message}</span>
                                    <span className="text-xs px-1 text-customGray-200">{chat.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2 px-3 border-t">
                        <span className="text-lg cursor-pointer text-customBlue-default">{ReactIcons.PHOTO_GALLERY}</span>

                        <InputField
                            inputData={{
                                type: 'text',
                                value: messageInput,
                                onChange: (e) => setMessageInput(e.target.value),
                                onKeyDown: handleKeyDown,
                            }}
                            inputStyle="w-full text-sm py-1.5 px-3 rounded-xl bg-customGray-100"
                        />

                        {messageInput ? (
                            <span
                                onClick={() => handleMessaging(user?.uid, selectedUserData?.uid, messageInput)}
                                className="text-lg cursor-pointer text-customBlue-default"
                            >
                                {ReactIcons.SEND_ARROW}
                            </span>
                        ) : (
                            <span className="text-lg cursor-not-allowed text-customGray-100">
                                {ReactIcons.SEND_ARROW}
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col p-3 gap-3.5 cursor-pointer">
                    {searchedUser.length > 0 ? (searchedUser.map((data) => (
                        <div
                            key={data.uid}
                            onClick={() => setSelectedUser(data.uid)}
                            className="flex items-center gap-2"
                        >
                            <ProfileAvatar
                                userData={data}
                                imageStyleClass="w-10 h-10"
                                iconStyleClass="text-[38px]"
                            />

                            <p className="text-sm font-medium">{data.username}</p>
                        </div>
                    ))) : (
                        <p className="text-sm text-customGray-400">No users found</p>
                    )}
                </div>
            )}
        </div>
    )
}