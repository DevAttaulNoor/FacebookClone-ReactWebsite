import '../../CSS/Header/UserBox.css'
import React from 'react';
import { Avatar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../Firebase/firebase';
import { logoutUser } from '../../Redux/userSlice';
import { setClearMsg } from '../../Redux/messageSlice';
import { setClearPost } from '../../Redux/postSlice';
import { setClearReels } from '../../Redux/reelSlice';
import { setClearFriends } from '../../Redux/friendSlice';
import { setClearNotification } from '../../Redux/notificationSlice';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NightlightIcon from '@mui/icons-material/Nightlight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function UserBox() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigate('/');
                sessionStorage.removeItem('userData');
                sessionStorage.removeItem('selectedFriend');
                dispatch(logoutUser());
                dispatch(setClearMsg());
                dispatch(setClearPost());
                dispatch(setClearReels());
                dispatch(setClearFriends());
                dispatch(setClearNotification());
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    return (
        <div className="userBox">
            <div className='userBoxOptions'>
                <NavLink to="/userhomepage/post">
                    <div className='userBoxOption'>
                        <div className='userBoxOptionLeft'>
                            <Avatar src={user.photoURL} />
                            <p>{user.username}</p>
                        </div>
                    </div>
                </NavLink>

                <div className='userBoxOption'>
                    <div className='userBoxOptionLeft'>
                        <SettingsIcon />
                        <p>Setting & privacy</p>
                    </div>
                    <div className='userBoxOptionRight'>
                        <ArrowForwardIosIcon />
                    </div>
                </div>

                <div className='userBoxOption'>
                    <div className='userBoxOptionLeft'>
                        <HelpIcon />
                        <p>Help & support</p>
                    </div>
                    <div className='userBoxOptionRight'>
                        <ArrowForwardIosIcon />
                    </div>
                </div>

                <div className='userBoxOption'>
                    <div className='userBoxOptionLeft'>
                        <NightlightIcon />
                        <p>Display & accessibility</p>
                    </div>
                    <div className='userBoxOptionRight'>
                        <ArrowForwardIosIcon />
                    </div>
                </div>

                <div className='userBoxOption' onClick={handleSignOut}>
                    <div className='userBoxOptionLeft'>
                        <LogoutIcon />
                        <p>Log out</p>
                    </div>
                </div>
            </div>

            <div className='userBoxTerms'>
                <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
            </div>
        </div>
    )
}

export default UserBox