export const StoryCard = () => {
    return (
        <NavLink
            to={`/reelpage/${reelContent.id}`}
            key={reelContent.id}
            onClick={() => dispatch(setSelectedReel(reelContent.id))}
        >
            <div
                className="reelFeed_ScrollReelsStories"
                style={{
                    backgroundImage: `url(${reelContent.reel[[reelContent.reel.length - 1]].background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Avatar src={reelContent.photoURL} />
                <p>{reelContent.username}</p>
            </div>
        </NavLink>
    )
}
