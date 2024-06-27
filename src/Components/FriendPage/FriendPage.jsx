import '../../CSS/FriendPage/FriendPage.css'
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import FriendpageHome from './FriendpageHome';
import FriendpageFriendReqs from './FriendpageFriendReqs';
import FriendpageAllFriends from './FriendpageAllFriends';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function FriendPage() {
    return (
        <div className='friendpage'>
            <div className='friendpageLeftbar'>
                <div className="friendpageLeftbarTop">
                    <p>Friends</p>
                    <SettingsIcon />
                </div>

                <div className="friendpageLeftbarBottom">
                    <NavLink to="/friendpage/" activeclassname="active">
                        <div className="friendpageLeftbarBottomOption">
                            <div className="friendpageLeftbarBottomOptionLeft">
                                <SupervisorAccountIcon />
                                <p>Home</p>
                            </div>
                            <div className="friendpageLeftbarBottomOptionRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>

                    <NavLink to="/friendpage/friendReqs" activeclassname="active">
                        <div className="friendpageLeftbarBottomOption">
                            <div className="friendpageLeftbarBottomOptionLeft">
                                <PersonAddAlt1Icon />
                                <p>Friend Requests</p>
                            </div>
                            <div className="friendpageLeftbarBottomOptionRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>

                    <Routes>
                        <Route path="allFriends" element={<FriendpageAllFriends />} />
                    </Routes>

                    <NavLink to="/friendpage/allFriends">
                        <div className="friendpageLeftbarBottomOption">
                            <div className="friendpageLeftbarBottomOptionLeft">
                                <PersonAddAlt1Icon />
                                <p>All friends</p>
                            </div>
                            <div className="friendpageLeftbarBottomOptionRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='friendpageMain'>
                <Routes>
                    <Route path="/" element={<FriendpageHome />} />
                    <Route path="friendReqs" element={<FriendpageFriendReqs />} />
                </Routes>
            </div>
        </div>
    );
}

export default FriendPage;