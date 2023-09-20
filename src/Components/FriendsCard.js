import "../CSS/FriendsCard.css"
import React from 'react'

function FriendsCard({user}) {
    return (
        <div className='friendsCard'>
            <div className="friendsCard_top">
                <img src={user.photoURL} alt="" />
            </div>
            <div className="friendsCard_bottom">
                <p id="friendName">{user.username}</p>
                <p id="friendMutual">Mutual friends</p>
                <button id="addBtn">Add friend</button>
                <button id="removeBtn">Remove</button>
            </div>
        </div>
    )
}

export default FriendsCard