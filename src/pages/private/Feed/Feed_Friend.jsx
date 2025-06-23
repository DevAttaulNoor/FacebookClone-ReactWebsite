import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed"
import { RegularPostSkeleton } from "@components/universal/loading-skeletons/RegularPostSkeleton"

const Feed_Friend = ({ usersData, postsLoading, postsData, postContainerStyle }) => {
    return (
        <>
            {postsData.length > 0 ? (
                <>
                    {postsLoading ? (
                        <RegularPostSkeleton
                            postContainerStyle={postContainerStyle}
                        />
                    ) : (
                        <RegularPostFeed
                            usersData={usersData}
                            postsData={postsData}
                            postContainerStyle={postContainerStyle}
                        />
                    )}
                </>
            ) : (
                <div className="h-full flex items-center justify-center px-10">
                    Currently you have no friends post.
                </div>
            )}
        </>
    )
}

export default Feed_Friend