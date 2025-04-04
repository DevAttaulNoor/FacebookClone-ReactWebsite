import { FeedPost } from "@components/universal/feed-related/FeedPost"

const Feed_Friend = ({ userData, postData, postContainerStyle }) => {
    return (
        <FeedPost
            userData={userData}
            postData={postData}
            postContainerStyle={postContainerStyle}
        />
    )
}

export default Feed_Friend