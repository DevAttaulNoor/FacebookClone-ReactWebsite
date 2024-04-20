import '../../CSS/FriendsPage/FriendPage.css'
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
        <div className='friendspage'>
            <div className='friendspageLeftbar'>
                <div className="friendspageLeftbar_Top">
                    <p>Friends</p>
                    <SettingsIcon />
                </div>

                <div className="friendspageLeftbar_Bottom">
                    <NavLink to="/friendpage/" activeclassname="active">
                        <div className="friendspageLeftbar_BottomOptions">
                            <div className="friendspageLeftbar_BottomOptionsLeft">
                                <SupervisorAccountIcon />
                                <p>Home</p>
                            </div>
                            <div className="friendspageLeftbar_BottomOptionsRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>

                    <NavLink to="/friendpage/friendReqs" activeclassname="active">
                        <div className="friendspageLeftbar_BottomOptions">
                            <div className="friendspageLeftbar_BottomOptionsLeft">
                                <PersonAddAlt1Icon />
                                <p>Friend Requests</p>
                            </div>
                            <div className="friendspageLeftbar_BottomOptionsRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>

                    <Routes>
                        <Route path="allFriends" element={<FriendpageAllFriends />} />
                    </Routes>

                    <NavLink to="/friendpage/allFriends">
                        <div className="friendspageLeftbar_BottomOptions">
                            <div className="friendspageLeftbar_BottomOptionsLeft">
                                <PersonAddAlt1Icon />
                                <p>All friends</p>
                            </div>
                            <div className="friendspageLeftbar_BottomOptionsRight">
                                <ArrowForwardIosIcon />
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='friendspageMain'>
                <Routes>
                    <Route path="/" element={<FriendpageHome />} />
                    <Route path="friendReqs" element={<FriendpageFriendReqs />} />
                </Routes>
            </div>
        </div>
    );
}

export default FriendPage;