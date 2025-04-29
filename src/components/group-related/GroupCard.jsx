import { BasicButton } from '@components/universal/buttons/BasicButton';
import group_coverphoto from '/Images/universal/group/group-coverphoto.png';

export const GroupCard = ({
    userData,
    groupData,
    joiningLoading,
    userRelatedGroup,
    handleGroupJoining
}) => {
    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white'>
            {groupData?.coverPhoto ? (
                <img
                    src={groupData?.coverPhoto}
                    alt={`cover photo of ${groupData?.name}`}
                    className="h-60 rounded-t-lg object-cover"
                />
            ) : (
                <img
                    src={group_coverphoto}
                    alt={`cover photo of ${groupData?.name}`}
                    className="h-60 rounded-t-lg object-cover"
                />
            )}

            <div className='flex flex-col px-3'>
                <h5 className="font-medium">{groupData?.name}</h5>
                <p className='text-sm text-customGray-200'>{`${groupData?.members?.length} ${groupData?.members?.length > 1 ? 'members' : 'member'}`}</p>
            </div>

            <div className='flex flex-col p-3 gap-2'>
                {userRelatedGroup ? (
                    <BasicButton
                        btnStyleClass='bg-customGray-100 hover:bg-customGray-default'
                        btnData={{
                            link: `/group/${groupData?.id}`,
                            text: 'View group'
                        }}
                    />
                ) : (
                    <>
                        {joiningLoading ? (
                            <BasicButton
                                btnStyleClass='!py-2 bg-customGray-100 hover:bg-customGray-default'
                                btnData={{
                                    textStyleClass: 'w-5 h-5 mx-auto border-2 border-b-0 animate-spin rounded-full border-customGray-200'
                                }}
                            />
                        ) : (
                            <BasicButton
                                btnStyleClass='bg-customGray-100 hover:bg-customGray-default'
                                btnData={{
                                    text: 'Join',
                                    onClick: () => handleGroupJoining(userData.uid, groupData.id)
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </div >
    )
}