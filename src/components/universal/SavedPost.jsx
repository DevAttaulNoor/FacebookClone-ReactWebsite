import { ProfileAvatar } from "./ProfileAvatar"
import { ReactIcons } from "@constants/ReactIcons"
import { BasicButton } from "./buttons/BasicButton"
import { handleSaving } from "@utils/EntityHandling"

export const SavedPost = ({ savedPostData, savedPostUser, savedPostGroup }) => {
    return (
        <div className='w-full h-40 flex p-3 gap-4 rounded-md shadow-customFull2 bg-white'>
            {savedPostData?.media ? (
                <img
                    src={savedPostData?.media}
                    alt={`image of ${savedPostUser?.username} post`}
                    className="w-36 cursor-pointer object-cover rounded-md"
                />
            ) : (
                <>
                    {savedPostUser?.profilePhoto ? (
                        <img
                            src={savedPostUser?.profilePhoto}
                            alt={`image of ${savedPostUser?.username}`}
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
                    <h3 className="text-lg font-bold cursor-pointer hover:underline">
                        {savedPostData?.message ? savedPostData?.message : (savedPostData?.mediaType === 'video' ? '1 Video' : '1 Photo')}
                    </h3>

                    {savedPostData?.groupId ? (
                        <div className='flex items-center gap-1'>
                            <>
                                {savedPostData?.isAnonymous ? (
                                    <div className="relative mr-1">
                                        <img
                                            src={savedPostData?.coverPhoto}
                                            alt={`cover picture of ${savedPostData?.name}`}
                                            className='w-8 h-8 object-contain border rounded-lg border-customGray-100 bg-white'
                                        />

                                        <div className="absolute -bottom-2 -right-2">
                                            <span className='text-xl'>
                                                {ReactIcons.PROFILE_AVATAR}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative mr-1">
                                        <img
                                            src={savedPostData?.coverPhoto}
                                            alt={`cover picture of ${savedPostData?.name}`}
                                            className='w-8 h-8 object-contain border rounded-lg border-customGray-100 bg-white'
                                        />

                                        <div className="absolute -bottom-2 -right-2">
                                            <ProfileAvatar
                                                userData={savedPostUser}
                                                imageStyleClass='w-5 h-5'
                                                iconStyleClass='text-xl'
                                            />
                                        </div>
                                    </div>
                                )}
                            </>

                            <p className="text-xs text-customGray-300">Saved from</p>

                            <span className="text-xs font-medium cursor-pointer hover:underline">
                                {savedPostData?.isAnonymous ? 'Anonymous participant' : savedPostUser?.username}'s post
                            </span>

                            <p className="text-xs text-customGray-300">in</p>

                            <span className="text-xs font-medium cursor-pointer hover:underline">
                                {savedPostGroup?.name}
                            </span>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <ProfileAvatar
                                userData={savedPostUser}
                                imageStyleClass='w-6 h-6'
                                iconStyleClass='text-xl'
                            />

                            <p className="text-xs text-customGray-300">Saved from</p>
                            <span className="text-xs font-medium cursor-pointer hover:underline">{savedPostUser?.username}'s {savedPostData?.mediaType === 'reel' ? 'reel' : 'post'}</span>
                        </div>
                    )}
                </div>

                <BasicButton
                    btnStyleClass="!w-32 bg-customGray-100 hover:bg-customGray-default"
                    btnData={{
                        text: 'Unsave',
                        onClick: () => handleSaving((savedPostData?.mediaType === 'reel' ? 'Reels' : 'Posts'), savedPostData?.id, user.uid)
                    }}
                />
            </div>
        </div>
    )
}
