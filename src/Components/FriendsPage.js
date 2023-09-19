import "../CSS/FriendsPage.css"
import React from 'react'
import FriendsCard from './FriendsCard'

function FriendsPage() {
    return (
        <div className='friends'>
            <div className="friendsleftbar">
                <h1>Friends</h1>
                <a href="">Home</a>
                <a href="">Friend Requests</a>
                <a href="">All friends</a>
            </div>
            <div className='friendsMain'>
                <h2>People you may know</h2>
                <FriendsCard />
            </div>
        </div>
    )
}

export default FriendsPage