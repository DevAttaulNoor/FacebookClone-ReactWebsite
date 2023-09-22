import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import FriendsPage_Home from './FriendsPage_Home';
import FriendsPage_FriendsReqs from './FriendsPage_FriendsReqs';
import FriendsPage_AllFriends from './FriendsPage_AllFriends';

function FriendsPage() {
    return (
        <div className='friends'>
            <div className="friendsleftbar">
                <h1>Friends</h1>
                <Link to="/friendpage/">Home</Link>
                <Link to="/friendpage/friendReqs">Friend Requests</Link>
                <Link to="/friendpage/allFriends">All friends</Link>
            </div>
            <div className='friendsMain'>
                <div className="friendsMain_top">
                    <h2>People you may know</h2>
                </div>
                <div className="friendsMain_bottom">
                    <Routes>
                        <Route path="/" element={<FriendsPage_Home />} />
                        <Route path="friendReqs" element={<FriendsPage_FriendsReqs />} />
                        <Route path="allFriends" element={<FriendsPage_AllFriends />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default FriendsPage;
