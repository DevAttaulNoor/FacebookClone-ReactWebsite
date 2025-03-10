import { ReactIcons } from "@constants/ReactIcons"

export const FeedPost = ({ userData, postData, postContainerStyle = 'w-full' }) => {
    return (
        <>
            {postData.map((data) => {
                const postUser = userData.find(user => user.uid === data.uid);

                return (
                    <div key={data.id} className={`${postContainerStyle} flex flex-col gap-4 rounded-xl shadow-customFull2 bg-white`}>
                        <div className="flex items-center justify-between p-4 pb-0">
                            <div className="flex items-center gap-2.5">
                                {postUser?.profilePhoto ? (
                                    <img
                                        src={postUser?.profilePhoto}
                                        alt={`profile picture of ${postUser?.username}`}
                                        className="w-10 h-10 rounded-full border border-customGray-100 object-contain bg-white"
                                    />
                                ) : (
                                    <span className="text-4xl">
                                        {ReactIcons.PROFILE_AVATAR}
                                    </span>
                                )}

                                <div className="postUserInfo">
                                    <h5 className="text-sm font-medium cursor-pointer hover:underline">{postUser?.username}</h5>

                                    <p className="text-sm text-customGray-200 cursor-pointer">timestamp</p>
                                </div>
                            </div>

                            <div className="p-2 rounded-full cursor-pointer hover:bg-customGray-100">
                                <span>{ReactIcons.OPTIONS_THREE_DOTS}</span>
                            </div>
                        </div>

                        <div className="flex flex-col px-4 gap-4">
                            {data.message && (
                                <p>{data.message}</p>
                            )}

                            {data.mediaType === 'image' && (
                                <img
                                    src={data.media}
                                    alt={`image of ${data.media}`}
                                    className="max-h-[500px] w-full h-full object-contain bg-customGray-default"
                                />
                            )}

                            {data.mediaType === 'video' && (
                                <video controls className="max-h-[500px] w-full h-full object-contain bg-customGray-default">
                                    <source src={data.media} type="video/mp4" />
                                </video>
                            )}
                        </div>

                        <div className='grid grid-cols-2 mx-4 py-2 gap-1 border-t border-t-slate-400'>
                            <div className="flex items-center justify-center p-1 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-100">
                                <span className="text-xl text-customGray-300">{ReactIcons.LIKE_OUTLINE}</span>
                                <p className="text-sm font-medium text-customGray-300">Like</p>
                            </div>

                            <div className="flex items-center justify-center p-1 gap-1.5 rounded-md cursor-pointer hover:bg-customGray-100">
                                <span className="text-xl text-customGray-300">{ReactIcons.COMMENT}</span>
                                <p className="text-sm font-medium text-customGray-300">Comment</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}