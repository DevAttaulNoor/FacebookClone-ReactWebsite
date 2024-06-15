import '../../CSS/Header/MenuBox.css';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/firebase';
import { logoutUser } from '../../Redux/userSlice';
import { setClearMsg } from '../../Redux/messageSlice';
import { setClearPost } from '../../Redux/postSlice';
import { setClearReels } from '../../Redux/reelSlice';
import { setClearFriends } from '../../Redux/friendSlice';
import { setChatNotiBoxVisible, setClearNotification, setMenuBoxVisible, setNotiBoxVisible } from '../../Redux/notificationSlice';
import MessageBox from './MessageBox';
import NotificationBox from './NotificationBox';
import HelpIcon from '@mui/icons-material/Help';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NightlightIcon from '@mui/icons-material/Nightlight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function MenuBox() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const allNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const notiBoxVisible = useSelector((state) => state.data.notification.notiBoxVisible);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const chatNotiBoxVisible = useSelector((state) => state.data.notification.chatNotiBoxVisible);
    const [currentView, setCurrentView] = useState('menu');
    const msgBoxRef = useRef(null);
    const notiBoxRef = useRef(null);

    const handleToggle = (currentVisibility, setVisibilityAction, view) => {
        dispatch(setVisibilityAction(!currentVisibility));
        setCurrentView(view);
    };

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

    useEffect(() => {
        const boxes = [
            { ref: notiBoxRef, visible: notiBoxVisible, setVisible: (value) => dispatch(setNotiBoxVisible(value)) },
            { ref: msgBoxRef, visible: chatNotiBoxVisible, setVisible: (value) => dispatch(setChatNotiBoxVisible(value)) },
        ];

        const handleOutsideClick = (e) => {
            boxes.forEach(({ ref, visible, setVisible }) => {
                if (ref.current && !ref.current.contains(e.target) && visible) {
                    setVisible(false);
                }
            });
        };

        window.addEventListener("click", handleOutsideClick);

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [notiBoxVisible, chatNotiBoxVisible, dispatch]);

    return (
        <>
            {currentView === 'menu' && (
                <div className="menuBox" onClick={(e) => e.stopPropagation()}>
                    <div className='menuBoxOptions'>
                        <NavLink to="/userhomepage/post" onClick={() => dispatch(setMenuBoxVisible(false))}>
                            <div className='menuBoxOption'>
                                <div className='menuBoxOptionLeft'>
                                    <Avatar src={user.photoURL} />
                                    <p>{user.username}</p>
                                </div>
                            </div>
                        </NavLink>

                        <div className='menuBoxOption' onClick={() => handleToggle(chatNotiBoxVisible, setChatNotiBoxVisible, 'chat')} ref={msgBoxRef}>
                            <div className='menuBoxOptionLeft'>
                                <ForumIcon className='headerNormalRightOptionSvg' />
                                {chatNotification.length > 0 && <p id='msgLengthIcon'>{chatNotification.length}</p>}
                                <p>Chats</p>
                            </div>
                            <div className='menuBoxOptionRight'>
                                <ArrowForwardIosIcon />
                            </div>
                        </div>

                        <div className='menuBoxOption' onClick={() => handleToggle(notiBoxVisible, setNotiBoxVisible, 'noti')} ref={notiBoxRef}>
                            <div className='menuBoxOptionLeft'>
                                <NotificationsIcon className='headerNormalRightOptionSvg' />
                                {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                                <p>Notifications</p>
                            </div>
                            <div className='menuBoxOptionRight'>
                                <ArrowForwardIosIcon />
                            </div>
                        </div>

                        <div className='menuBoxOption'>
                            <div className='menuBoxOptionLeft'>
                                <SettingsIcon />
                                <p>Setting & privacy</p>
                            </div>
                            <div className='menuBoxOptionRight'>
                                <ArrowForwardIosIcon />
                            </div>
                        </div>

                        <div className='menuBoxOption'>
                            <div className='menuBoxOptionLeft'>
                                <HelpIcon />
                                <p>Help & support</p>
                            </div>
                            <div className='menuBoxOptionRight'>
                                <ArrowForwardIosIcon />
                            </div>
                        </div>

                        <div className='menuBoxOption'>
                            <div className='menuBoxOptionLeft'>
                                <NightlightIcon />
                                <p>Display & accessibility</p>
                            </div>
                            <div className='menuBoxOptionRight'>
                                <ArrowForwardIosIcon />
                            </div>
                        </div>

                        <div className='menuBoxOption' onClick={handleSignOut}>
                            <div className='menuBoxOptionLeft'>
                                <LogoutIcon />
                                <p>Log out</p>
                            </div>
                        </div>
                    </div>

                    <div className='menuBoxTerms'>
                        <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
                    </div>
                </div>
            )}

            {currentView === 'chat' && (
                <MessageBox />
            )}

            {currentView === 'noti' && (
                <NotificationBox />
            )}
        </>
    );
}

export default MenuBox;