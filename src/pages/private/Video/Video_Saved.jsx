import { SavedPost } from "@components/universal/post-related/SavedPost";

const Video_Saved = ({ activeUser, userData, postData }) => {
    const savedVideoPosts = postData?.filter(post => post?.saves?.some(save => save.uid === activeUser?.uid));

    return (
        <div className='w-full flex flex-col gap-4 overflow-y-auto sm:px-4 sm:py-4 md:px-8 lg:px-12 xl:px-16'>
            {savedVideoPosts.length > 0 ? (
                <>
                    {savedVideoPosts?.map((data) => {
                        const savedVideoPostUser = userData?.find(user => user.uid === data.uid);

                        return (
                            <SavedPost
                                key={data.id}
                                savedPostData={data}
                                savedPostUser={savedVideoPostUser}
                            />
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