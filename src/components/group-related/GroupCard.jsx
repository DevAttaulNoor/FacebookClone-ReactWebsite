import { useState } from 'react';
import { handleGroupJoining } from '@utils/GroupHandling';
import { BasicButton } from '@components/universal/buttons/BasicButton';
import { ButtonWithLoadingLayout } from '@layouts/ButtonWithLoadingLayout';

export const GroupCard = ({
    userData,
    groupData,
    userRelatedGroup,
}) => {
    const [loading, setLoading] = useState(false);

    return (
        <div className='max-w-72 w-full flex flex-col rounded-lg mx-auto gap-1.5 shadow-customFull2 bg-white'>
            <img
                src={groupData?.coverPhoto}
                alt={`cover photo of ${groupData?.name}`}
                className="h-60 rounded-t-lg object-cover"
            />

            <div className='flex flex-col px-3'>
                <h5 className="font-medium">{groupData?.name}</h5>
                <p className='text-sm text-customGray-200'>{`${groupData?.members?.length} ${groupData?.members?.length > 1 ? 'members' : 'member'}`}</p>
            </div>

            <div className='flex flex-col p-3 gap-2'>
                <BasicButton
                    btnStyleClass='bg-customGray-100 hover:bg-customGray-default'
                    btnData={{
                        link: `/group/${groupData?.id}`,
                        text: 'View group'
                    }}
                />

                {!userRelatedGroup && (
                    <ButtonWithLoadingLayout
                        loadingState={loading}
                        btnStyleClass={'text-customBlue-default bg-customBlue-100 hover:bg-customGray-default'}
                        loadingBtn={{
                            btnStyleClass: '!py-2',
                            textStyleClass: 'w-6 h-6 !border-customBlue-default'
                        }}
                        actionBtn={{
                            text: 'Join',
                            onClick: () => handleGroupJoining(userData.uid, groupData.id, setLoading)
                        }}
                    />
                )}
            </div>
        </div >
    )
}