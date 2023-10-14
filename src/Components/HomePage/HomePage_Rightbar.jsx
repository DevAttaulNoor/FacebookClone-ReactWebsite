import '../../CSS/HomePage/HomePage_Rightbar.css'
import React from 'react'
import HomePage_Rightbar_GroupsList from './HomePage_Rightbar_GroupsList'
import HomePage_Rightbar_FriendsList from './HomePage_Rightbar_FriendsList'

function HomePage_Rightbar() {
    return (
        <div className='homepage_Rightbar'>
            <div className="homepage_Rightbar_Top">
                <HomePage_Rightbar_FriendsList />
            </div>
            <hr id='line'/>
            <div className="homepage_Rightbar_Bottom">
                <HomePage_Rightbar_GroupsList />
            </div>
        </div>
    )
}

export default HomePage_Rightbar