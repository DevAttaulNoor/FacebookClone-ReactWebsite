import '../../CSS/ProfilePage/ProfilepageComponentsPost.css'
import React from 'react';
import ProfilepageFeed from './ProfilepageFeed';
import ProfilepageInfo from './ProfilepageInfo';
import ProfilepagePhotos from './ProfilepagePhotos';
import ProfilepageFriends from './ProfilepageFriends';

function ProfilepageComponentsPost({userData}) {
    return (
        <div className='ProfilePageComponentsPost'>
            <div className="ProfilePageComponentsPost_Left">
                <div className="userIntro">
                    <ProfilepageInfo userData={userData} />
                </div>
                <div className="userPhotos">
                    <ProfilepagePhotos userData={userData} />
                </div>
                <div className="userFriends">
                    <ProfilepageFriends userData={userData} />
                </div>
            </div>
            <div className="ProfilePageComponentsPost_Right">
                <div className="userFeed">
                    <ProfilepageFeed userData={userData} />
                </div>
            </div>
        </div>
    )
}

export default ProfilepageComponentsPost;