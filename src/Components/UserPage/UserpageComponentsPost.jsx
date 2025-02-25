import '../../CSS/UserPage/UserpageComponentsPost.css'
import React from 'react'
import UserpageFeed from './UserpageFeed'
import UserpageInfo from './UserpageInfo'
import UserpagePhotos from './UserpagePhotos'
import UserpageVideos from './UserpageVideos'
import UserpageFriends from './UserpageFriends'

function UserpageComponentsPost() {
    return (
        <div className='userpageComponentsPost'>
                <div className="userpageComponentsPost_Left">
                    <div className="userIntro">
                        <UserpageInfo />
                    </div>
                    <div className="userPhotos">
                        <UserpagePhotos />
                    </div>
                    <div className="userVideos">
                        <UserpageVideos />
                    </div>
                    <div className="userFriends">
                        <UserpageFriends />
                    </div>
                </div>
                <div className="userpageComponentsPost_Right">
                    <div className="userFeed">
                        <UserpageFeed />
                    </div>
                </div>
        </div>
    )
}

export default UserpageComponentsPost;