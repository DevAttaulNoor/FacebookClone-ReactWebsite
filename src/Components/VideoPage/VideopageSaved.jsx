import '../../CSS/VideoPage/VideopageSaved.css'
import React from 'react'
import { useSelector } from 'react-redux';
import { timeAgo } from '../../Assets/Utility/TimeModule';
import PostFeed from '../PostPage/PostFeed';

function VideopageSaved() {
    const savedItemsData = useSelector((state) => state.data.savedItems.savedItemsData);
    const savedVideos = savedItemsData.filter(item => item.data.mediaType === 'video')

    return (
        <div className='videopageSaved'>
            {savedVideos.map(savedItem => {
                return (
                    <PostFeed
                        id={savedItem.id}
                        userid={savedItem.data.uid}
                        username={savedItem.data.username}
                        photoURL={savedItem.data.photoURL}
                        message={savedItem.data.message}
                        media={savedItem.data.media}
                        mediaType={savedItem.data.mediaType}
                        timestamp={timeAgo(savedItem.data.timestamp)}
                        key={savedItem.id}
                    />
                );
            })}
        </div>
    )
}

export default VideopageSaved