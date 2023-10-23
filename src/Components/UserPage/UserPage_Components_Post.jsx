import '../../CSS/UserPage/UserPage_Components_Post.css'
import React from 'react'
import UserPage_Feed from "./UserPage_Feed";
import UserPage_Info from "./UserPage_Info";
import UserPage_Friends from "./UserPage_Friends";
import UserPage_Photos from "./UserPage_Photos";

function UserPage_Components_Post() {
    return (
        <div className='UserPageComponentsPost'>
                <div className="UserPageComponentsPost_Left">
                    <div className="userIntro">
                        <UserPage_Info />
                    </div>
                    <div className="userPhotos">
                        <UserPage_Photos />
                    </div>
                    <div className="userFriends">
                        <UserPage_Friends />
                    </div>
                </div>
                <div className="UserPageComponentsPost_Right">
                    <div className="userFeed">
                        <UserPage_Feed />
                    </div>
                </div>
        </div>
    )
}

export default UserPage_Components_Post