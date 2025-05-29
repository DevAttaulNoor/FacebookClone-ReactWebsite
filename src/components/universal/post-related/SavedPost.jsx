import { ProfileAvatar } from "../ProfileAvatar"
import { ReactIcons } from "@constants/ReactIcons"
import { BasicButton } from "../buttons/BasicButton"
import { handleSaving } from "@utils/EntityHandling"

export const SavedPost = ({ savedPostData, savedPostUser, savedPostGroup }) => {
    return (
        <div className='w-full h-28 flex p-3 gap-2 lg:gap-4 rounded-md shadow-customFull2 bg-white sm:h-32 lg:h-36 2xl:h-40'>
            {savedPostData?.media ? (
                <img
                    src={savedPostData?.media}
                    alt={`image of ${savedPostUser?.username} post`}
                    className="w-20 object-cover rounded-md cursor-pointer xs:w-24 sm:w-28 lg:w-32 2xl:w-36"
                />
            ) : (
                <>
                    {savedPostUser?.profilePhoto ? (
                        <img
                            src={savedPostUser?.profilePhoto}
                            alt={`image of ${savedPostUser?.username}`}
                            className="w-20 object-cover rounded-md cursor-pointer xs:w-24 sm:w-28 lg:w-32 2xl:w-36"
                        />
                    ) : (
                        <span className="flex items-center justify-center text-8xl h-52 w-full rounded-md bg-customGray-default">
                            {ReactIcons.PROFILE_AVATAR_WITHOUT_CIRCLE}
                        </span>
                    )}
                </>
            )}

            <div className='w-full flex flex-col justify-between gap-2'>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-none cursor-pointer hover:underline md:text-xl">
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

                            <p className="text-xs text-customGray-300">
                                Saved from <strong className="cursor-pointer hover:underline">{savedPostData?.isAnonymous ? 'Anonymous participant' : savedPostUser?.username}</strong>'s post in <strong className="cursor-pointer hover:underline">{savedPostGroup?.name}</strong>
                            </p>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <ProfileAvatar
                                userData={savedPostUser}
                                imageStyleClass='w-6 h-6'
                                iconStyleClass='text-xl'
                            />

                            <p className="text-xs text-customGray-300">
                                Saved from <strong className="cursor-pointer hover:underline">{savedPostUser?.username}</strong>'s {savedPostData?.mediaType === 'reel' ? 'reel' : 'post'}
                            </p>
                        </div>
                    )}
                </div>

                <BasicButton
                    btnStyleClass="bg-customGray-100 hover:bg-customGray-default xs:w-28 lg:w-32"
                    btnData={{
                        text: 'Unsave',
                        onClick: () => handleSaving((savedPostData?.mediaType === 'reel' ? 'Reels' : 'Posts'), savedPostData?.id, user.uid)
                    }}
                />
            </div>
        </div>
    )
}
