import '../../CSS/FriendsPage/FriendsPage_AllFriends_Main.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from '../ProfilePage/ProfilePage'

function FriendsPage_AllFriends_Main() {
    return (
        <div className='friendspage_AllfriendsMain'>
            <Routes>
                <Route path="profilepage/:userid/*" element={<ProfilePage />} />
            </Routes>
        </div>
    )
}

export default FriendsPage_AllFriends_Main