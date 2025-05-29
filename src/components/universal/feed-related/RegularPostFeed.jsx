import { RegularPost } from "../post-related/RegularPost"

export const RegularPostFeed = ({
    userData,
    usersData,
    postsData,
    groupData,
    usedInGroupPosting = false,
    postContainerStyle = 'w-full',
}) => {
    return (
        <>
            {postsData?.sort((a, b) => b.timestamp - a.timestamp).map((data) => (
                <RegularPost
                    key={data.id}
                    userData={userData}
                    usersData={usersData}
                    postData={data}
                    postsData={postsData}
                    groupData={groupData}
                    usedInGroupPosting={usedInGroupPosting}
                    postContainerStyle={postContainerStyle}
                />
            ))}
        </>
    )
}