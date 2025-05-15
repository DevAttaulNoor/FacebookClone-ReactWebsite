import { Link } from 'react-router';
import { ProfileAvatar } from '../ProfileAvatar';
import { ModalLayout } from '@layouts/ModalLayout';
import { ReactIcons } from '@constants/ReactIcons';

export const ReactingModal = ({
    modalStateData,
    entityData,
    usersData
}) => {
    return (
        <ModalLayout
            isOpen={true}
            containerStyle={'relative max-h-96 p-3 gap-3'}
        >
            <div className="flex justify-center">
                <h1 className="text-lg font-bold">Reactions</h1>

                <span
                    onClick={() => modalStateData.setModalOpen(prev => ({ ...prev, reaction: null }))}
                    className="absolute top-2 right-2 p-1 cursor-pointer rounded-full hover:bg-customGray-default"
                >
                    {ReactIcons.CLOSE}
                </span>
            </div>

            <hr className="text-customGray-default" />

            <div className='flex flex-col gap-3 overflow-y-auto'>
                {entityData?.reactions?.map((elem) => {
                    const users = usersData?.find(user => user.uid === elem.uid);

                    return (
                        <div key={elem} className="flex items-center gap-2">
                            <ProfileAvatar
                                userData={users}
                                imageStyleClass="w-10 h-10"
                                iconStyleClass="text-4xl"
                            />

                            <Link
                                to={`/profile/${users?.uid}`}
                                className="text-sm font-medium cursor-pointer hover:underline"
                            >
                                {users?.username}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </ModalLayout>
    )
}