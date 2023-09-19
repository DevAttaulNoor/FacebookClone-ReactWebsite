import "../CSS/FriendsCard.css"
import React from 'react'
import { useStateValue } from './StateProvider';

function FriendsCard() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className='friendsCard'>
            <div className="friendsCard_top">
                <img src={user.photoURL} alt="" />
            </div>
            <div className="friendsCard_bottom">
                <p id="friendName">{user.displayName}</p>
                <p id="friendMutual">Mutual friends</p>
                <button id="addBtn">Add friend</button>
                <button id="removeBtn">Remove</button>
            </div>
        </div>
    )
}

export default FriendsCard