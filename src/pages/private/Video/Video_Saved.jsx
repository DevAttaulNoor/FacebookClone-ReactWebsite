import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";

const Video_Saved = ({ activeUser, userData, postData }) => {
    const savedVideoPosts = postData?.filter(post => post?.saves?.some(save => save.uid === activeUser?.uid));

    return (
        <div className='w-full flex flex-col px-16 py-4 gap-4 overflow-y-auto'>
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

                                    <div className='flex gap-2'>
                                        <button className="text-sm font-medium flex items-center justify-center py-2 px-8 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">Add to collection</button>

                                        <span className="flex items-center justify-center text-xl px-2 rounded-md bg-customGray-100 cursor-pointer hover:bg-customGray-default">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <div className="w-full h-24 flex items-center justify-center text-xl font-semibold p-3 gap-4 rounded-md shadow-customFull2 text-customGray-300 bg-white">
                    You do not have any saved items.
                </div>
            )}
        </div>
    )
}

export default Video_Saved