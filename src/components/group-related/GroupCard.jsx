import { Link } from 'react-router';
import group_coverphoto from '/Images/universal/group/group-coverphoto.png';

export const GroupCard = ({
    userData,
    groupData,
    joiningLoading,
    handleGroupJoining
}) => {
    const groupJoined = groupData.adminId === userData?.uid || groupData.members?.some(mem => mem === userData?.uid)

    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white'>
            {groupData?.coverPhoto ? (
                <img
                    src={groupData?.coverPhoto}
                    alt={`cover photo of ${groupData?.name}`}
                    className="h-52 rounded-t-lg object-cover"
                />
            ) : (
                <img
                    src={group_coverphoto}
                    alt={`cover photo of ${groupData?.name}`}
                    className="h-52 rounded-t-lg object-cover"
                />
            )}

            <div className='flex flex-col px-3'>
                <h5 className="font-medium">{groupData?.name}</h5>
                <p className='text-sm text-customGray-200'>{`${groupData?.members?.length} ${groupData?.members?.length > 1 ? 'members' : 'member'}`}</p>
            </div>

            <div className='flex flex-col p-3 gap-2'>
                {groupJoined ? (
                    <Link
                        to={`/group/${groupData?.id}`}
                        className="w-full text-center text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default"
                    >
                        View group
                    </Link>
                ) : (
                    <>
                        {joiningLoading ? (
                            <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default">
                                <div className='w-5 h-5 mx-auto border-2 border-b-0 animate-spin rounded-full border-customGray-200' />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleGroupJoining(userData.uid, groupData.id)}
                                className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default"
                            >
                                Join
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}