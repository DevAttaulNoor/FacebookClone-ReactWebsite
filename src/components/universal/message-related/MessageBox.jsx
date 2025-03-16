import { useState } from "react";
import { useUsers } from "@hooks/useUsers";
import { useAuthUser } from "@hooks/useAuthUser";
import { ReactIcons } from "@constants/ReactIcons";
import { InputField } from "../inputs/InputField";
import { setDoc } from "firebase/firestore";
import { db } from "@services/firebase";

export const MessageBox = () => {
    const { user } = useAuthUser();
    const { users } = useUsers();
    const [searchInput, setSearchInput] = useState('');
    const [messageInput, setMessageInput] = useState('')
    const [selectedUser, setSelectedUser] = useState('');
    const searchedUser = users?.filter((data) => data?.username?.toLowerCase().includes(searchInput.toLowerCase()));

    const handleMessaging = async () => {
        // try {
        //     const chatRef = setDoc(doc(db, 'Chats'));

        //     await chat = 
        // } catch (error) {

        // }
    }

    return (
        <div className='absolute bottom-0 right-24 w-72 h-96 flex flex-col rounded-t-md shadow-customFull2 bg-white'>
            <div className="flex items-center justify-between p-2">
                <h5 className="text-sm font-medium">New message</h5>
                <span className="text-xl p-0.5 rounded-full cursor-pointer text-customGray-300 hover:bg-customGray-default">{ReactIcons.CLOSE}</span>
            </div>

            <div className='flex p-3 gap-3 border-b'>
                <p className="text-sm">To: </p>

                {selectedUser ? (
                    <div className="flex items-center p-2 gap-2 rounded-md text-customBlue-default bg-customGray-100">
                        <p className="text-xs font-medium">{selectedUser.username}</p>

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

            {selectedUser ? (
                <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-center py-5 px-3 gap-1">
                        {selectedUser.profilePhoto ? (
                            <img
                                src={selectedUser.profilePhoto}
                                alt={`profile picture of ${selectedUser.username}`}
                                className="w-16 h-16 rounded-full border border-customGray-100 object-contain bg-white"
                            />
                        ) : (
                            <span className="text-[64px]">{ReactIcons.PROFILE_AVATAR}</span>
                        )}

                        <p className="text-sm font-medium">{selectedUser.username}</p>
                    </div>

                    <div className="flex flex-col gap-2">

                    </div>

                    <div className="flex items-center gap-2 p-3 border-t">
                        <span className="text-lg cursor-pointer text-customBlue-default">{ReactIcons.PHOTO_GALLERY}</span>

                        <InputField
                            inputData={{
                                type: 'text',
                                value: messageInput,
                                onChange: (e) => setMessageInput(e.target.value),
                            }}
                            inputStyle="w-full text-sm py-1 px-2 rounded-xl bg-customGray-100"
                        />

                        <span className="text-lg cursor-pointer text-customBlue-default">{ReactIcons.SEND_ARROW}</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col p-3 gap-3.5 cursor-pointer">
                    {searchedUser.length > 0 ? (searchedUser.map((data) => (
                        <div
                            key={data.uid}
                            onClick={() => setSelectedUser(data)}
                            className="flex items-center gap-2"
                        >
                            {data.profilePhoto ? (
                                <img
                                    src={data.profilePhoto}
                                    alt={`profile picture of ${data.username}`}
                                    className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                />
                            ) : (
                                <span className="text-[38px]">{ReactIcons.PROFILE_AVATAR}</span>
                            )}

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