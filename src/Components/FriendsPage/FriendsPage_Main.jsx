import '../../CSS/FriendsPage/FriendsPage_Main.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FriendsPage_Main_Home from './FriendsPage_Main_Home';
import FriendsPage_Main_FriendReqs from './FriendsPage_Main_FriendReqs';

function FriendsPage_Main() {
    return (
        <div className='friendspageMain'>
            <Routes>
                <Route path="/" element={<FriendsPage_Main_Home />} />
                <Route path="friendReqs" element={<FriendsPage_Main_FriendReqs />} />
            </Routes>
        </div>
    );
}

export default FriendsPage_Main;