import { useState } from "react";
import { Link } from "react-router";
import { ProfileAvatar } from "../ProfileAvatar";
import { InputField } from "../inputs/InputField";
import { ReactIcons } from "@constants/ReactIcons";
import { ModalLayout } from "@layouts/ModalLayout";
import { timeAgoInitials } from "@utils/TimeModule";
import { handleCommenting } from "@utils/PostHandling";

export const CommentingModal = ({
    modalStateData,
    postData,
    userData,
    usersData,
}) => {
    const [input, setInput] = useState('');

    return (
        <ModalLayout
            isOpen={true}
            containerStyle={'relative max-h-96 p-3 gap-3'}
        >
            <div className="flex justify-center">
                <h1 className="text-lg font-bold">Comments</h1>

                <span
                    onClick={() => modalStateData.setModalOpen(prev => ({ ...prev, comment: null }))}
                    className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                >
                    {ReactIcons.CLOSE}
                </span>
            </div>

            <hr className="text-customGray-default" />

            <div className='flex flex-col gap-3 overflow-y-auto'>
                {postData?.comments?.sort((a, b) => a.timestamp - b.timestamp)?.map((elem) => {
                    const users = usersData?.find(user => user.uid === elem.uid);

                    return (
                        <div key={elem.id} className="flex gap-2">
                            <ProfileAvatar
                                userData={users}
                                imageStyleClass="w-10 h-10"
                                iconStyleClass="text-4xl"
                            />

                            <div className="flex flex-col">
                                <div className="px-3 py-1.5 rounded-2xl bg-customGray-default">
                                    <Link
                                        to={`/profile/${users?.uid}`}
                                        className="text-sm font-medium cursor-pointer hover:underline"
                                    >
                                        {users?.username}
                                    </Link>

                                    <p className="text-sm">{elem?.comment}</p>
                                </div>

                                <p className="text-xs ml-1 text-customGray-200 cursor-pointer">{timeAgoInitials(elem?.timestamp)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2">
                <ProfileAvatar
                    userData={userData}
                    imageStyleClass="w-10 h-10"
                    iconStyleClass="text-4xl"
                />

                <div className="w-full flex items-center px-3 py-2.5 gap-1.5 rounded-xl bg-customGray-default">
                    <InputField
                        inputData={{
                            type: 'text',
                            value: input,
                            placeholder: 'Write a comment...',
                            onChange: (e) => setInput(e.target.value),
                        }}
                        inputStyle="w-full text-sm bg-transparent"
                    />

                    {input ? (
                        <button
                            className='cursor-pointer text-customBlue-300'
                            onClick={() => {
                                handleCommenting(postData, userData?.uid, input)
                                setInput('')
                            }}
                        >
                            {ReactIcons.SEND_ARROW}
                        </button>
                    ) : (
                        <span className='cursor-not-allowed text-customGray-200'>
                            {ReactIcons.SEND_ARROW}
                        </span>
                    )}
                </div>
            </div>
        </ModalLayout>
    )
}
