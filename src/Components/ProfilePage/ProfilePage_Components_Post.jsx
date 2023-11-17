import '../../CSS/ProfilePage/ProfilePage_Components_Post.css'
import React from 'react'
import ProfilePage_Feed from "./ProfilePage_Feed";
import ProfilePage_Info from "./ProfilePage_Info";
import ProfilePage_Friends from "./ProfilePage_Friends";
import ProfilePage_Photos from "./ProfilePage_Photos";

function ProfilePage_Components_Post({userData}) {
    return (
        <div className='ProfilePageComponentsPost'>
            {/* {console.log(userData)} */}

            <div className="ProfilePageComponentsPost_Left">
                <div className="userIntro">
                    <ProfilePage_Info userData={userData} />
                </div>
                <div className="userPhotos">
                    <ProfilePage_Photos userData={userData} />
                </div>
                <div className="userFriends">
                    <ProfilePage_Friends userData={userData} />
                </div>
            </div>
            <div className="ProfilePageComponentsPost_Right">
                <div className="userFeed">
                    <ProfilePage_Feed userData={userData} />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage_Components_Post