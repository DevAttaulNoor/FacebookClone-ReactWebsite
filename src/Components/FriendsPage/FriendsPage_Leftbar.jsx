import '../../CSS/FriendsPage/FriendsPage_Leftbar.css'
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FriendsPage_AllFriends from './FriendsPage_AllFriends';

function FriendsPage_Leftbar() {
    return (
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
                    <Route path="allFriends" element={<FriendsPage_AllFriends />} />
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
    )
}

export default FriendsPage_Leftbar;