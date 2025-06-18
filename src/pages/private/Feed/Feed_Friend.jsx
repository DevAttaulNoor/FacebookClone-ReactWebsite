import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed"
import { RegularPostSkeleton } from "@components/universal/loading-skeletons/RegularPostSkeleton"

const Feed_Friend = ({ usersData, postsLoading, postsData, postContainerStyle }) => {
    return (
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
    )
}

export default Feed_Friend