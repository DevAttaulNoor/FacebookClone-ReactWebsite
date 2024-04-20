import '../../CSS/UserPage/UserpageComponentsPost.css'
import React from 'react'
import UserpageFeed from './UserpageFeed'
import UserpageInfo from './UserpageInfo'
import UserpagePhotos from './UserpagePhotos'
import UserpageVideos from './UserpageVideos'
import UserpageFriends from './UserpageFriends'

function UserpageComponentsPost() {
    return (
        <div className='UserPageComponentsPost'>
                <div className="UserPageComponentsPost_Left">
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
                <div className="UserPageComponentsPost_Right">
                    <div className="userFeed">
                        <UserpageFeed />
                    </div>
                </div>
        </div>
    )
}

export default UserpageComponentsPost;