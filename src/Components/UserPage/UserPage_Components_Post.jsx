import React from 'react'
import UserPage_Feed from "./UserPage_Feed";
import UserPage_Info from "./UserPage_Info";
import UserPage_Friends from "./UserPage_Friends";
import UserPage_Photos from "./UserPage_Photos";

function UserPage_Components_Post() {
    return (
        <div className='UserPageComponentsPost'>
            <div className="userpage_Bottom">
                <div className="userpage_BottomLeft">
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
                <div className="userpage_BottomRight">
                    <div className="userFeed">
                        <UserPage_Feed />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage_Components_Post