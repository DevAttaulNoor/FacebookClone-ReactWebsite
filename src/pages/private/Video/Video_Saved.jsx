import { ReactIcons } from "@constants/ReactIcons";
import { handleSaving } from "@utils/EntityHandling";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { BasicButton } from "@components/universal/buttons/BasicButton";

const Video_Saved = ({ activeUser, userData, postData }) => {
    const savedVideoPosts = postData?.filter(post => post?.saves?.some(save => save.uid === activeUser?.uid));

    return (
        <div className='w-full flex flex-col gap-4 overflow-y-auto sm:px-4 sm:py-4 md:px-8 lg:px-12 xl:px-16'>
            {savedVideoPosts.length > 0 ? (
                <>
                    {savedVideoPosts?.map((data) => {
                        const savedVideoPostUser = userData?.find(user => user.uid === data.uid);

                        return (
                            <div className='w-full h-40 flex p-3 gap-4 rounded-md shadow-customFull2 bg-white'>
                                {data?.media ? (
                                    <video controls className="w-36 cursor-pointer object-cover rounded-md">
                                        <source src={data?.media} type="video/mp4" />
                                    </video>
                                ) : (
                                    <>
                                        {savedVideoPostUser?.profilePhoto ? (
                                            <img
                                                src={savedVideoPostUser?.profilePhoto}
                                                alt={`image of ${savedVideoPostUser?.username}`}
                                                className="w-36 cursor-pointer object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="flex items-center justify-center text-8xl h-52 w-full rounded-md bg-customGray-default">
                                                {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                                            </span>
                                        )}
                                    </>
                                )}

                                <div className='flex flex-col justify-between'>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-bold cursor-pointer hover:underline">{data?.message ? data?.message : '1 Video'}</h3>

                                        <div className='flex items-center gap-1'>
                                            <ProfileAvatar
                                                userData={savedVideoPostUser}
                                                imageStyleClass='w-6 h-6'
                                                iconStyleClass='text-xl'
                                            />

                                            <p className="text-xs text-customGray-300">Saved from</p>
                                            <span className="text-xs font-medium cursor-pointer hover:underline">{savedVideoPostUser?.username}'s post</span>
                                        </div>
                                    </div>

                                    <BasicButton
                                        btnStyleClass="bg-customGray-100 hover:bg-customGray-default"
                                        btnData={{
                                            text: 'Unsave',
                                            onClick: () => handleSaving('Posts', data.id, activeUser?.uid)
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <div className="w-full h-24 flex items-center justify-center text-center text-xl font-semibold p-3 gap-4 rounded-md shadow-customFull2 text-customGray-300 bg-white">
                    You do not have any saved items.
                </div>
            )}
        </div>
    )
}

export default Video_Saved