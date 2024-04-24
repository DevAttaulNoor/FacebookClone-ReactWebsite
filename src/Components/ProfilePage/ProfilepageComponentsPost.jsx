import '../../CSS/ProfilePage/ProfilepageComponentsPost.css'
import React from 'react';
import ProfilepageFeed from './ProfilepageFeed';
import ProfilepageInfo from './ProfilepageInfo';
import ProfilepagePhotos from './ProfilepagePhotos';
import ProfilepageFriends from './ProfilepageFriends';
import ProfilepageVideos from './ProfilepageVideos';

function ProfilepageComponentsPost() {
    return (
        <div className='profilePageComponentsPost'>
            <div className="profilePageComponentsPost_Left">
                <div className="userIntro">
                    <ProfilepageInfo />
                </div>
                <div className="userPhotos">
                    <ProfilepagePhotos />
                </div>
                <div className="userVideos">
                    <ProfilepageVideos />
                </div>
                <div className="userFriends">
                    <ProfilepageFriends />
                </div>
            </div>
            <div className="profilePageComponentsPost_Right">
                <div className="userFeed">
                    <ProfilepageFeed />
                </div>
            </div>
        </div>
    )
}

export default ProfilepageComponentsPost;