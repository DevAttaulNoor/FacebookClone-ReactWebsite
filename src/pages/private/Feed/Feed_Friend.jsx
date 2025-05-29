import { RegularPostFeed } from "@components/universal/feed-related/RegularPostFeed"

const Feed_Friend = ({ usersData, postsData, postContainerStyle }) => {
    return (
        <RegularPostFeed
            usersData={usersData}
            postsData={postsData}
            postContainerStyle={postContainerStyle}
        />
    )
}

export default Feed_Friend