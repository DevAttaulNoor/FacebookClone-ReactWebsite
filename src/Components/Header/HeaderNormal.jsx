import '../../CSS/Header/HeaderNormal.css';
import fblogo from '../../Assets/Images/fblogo.png';
import React, { useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBoxVisible } from '../../Redux/searchSlice';
import { setChatNotiBoxVisible, setMenuBoxVisible, setNotiBoxVisible, setUserBoxVisible } from '../../Redux/notificationSlice';
import UserBox from './UserBox';
import SearchBox from './SearchBox';
import MessageBox from './MessageBox';
import NotificationBox from './NotificationBox';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';

import MenuIcon from '@mui/icons-material/Menu';
import MenuBox from './MenuBox';

function HeaderNormal() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const searchBoxVisible = useSelector((state) => state.data.search.searchBoxVisible);
    const notification = useSelector((state) => state.data.notification.notification);
    const allNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const notiBoxVisible = useSelector((state) => state.data.notification.notiBoxVisible);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const chatNotiBoxVisible = useSelector((state) => state.data.notification.chatNotiBoxVisible);
    const userBoxVisible = useSelector((state) => state.data.notification.userBoxVisible);
    const menuBoxVisible = useSelector((state) => state.data.notification.menuBoxVisible);
    const searchBoxRef = useRef(null);
    const msgBoxRef = useRef(null);
    const notiBoxRef = useRef(null);
    const userBoxRef = useRef(null);
    const menuBoxRef = useRef(null);

    const handleToggle = (currentVisibility, setVisibilityAction) => {
        dispatch(setVisibilityAction(!currentVisibility));
    };

    useEffect(() => {
        const boxes = [
            { ref: searchBoxRef, visible: searchBoxVisible, setVisible: (value) => dispatch(setSearchBoxVisible(value)) },
            { ref: msgBoxRef, visible: chatNotiBoxVisible, setVisible: (value) => dispatch(setChatNotiBoxVisible(value)) },
            { ref: notiBoxRef, visible: notiBoxVisible, setVisible: (value) => dispatch(setNotiBoxVisible(value)) },
            { ref: userBoxRef, visible: userBoxVisible, setVisible: (value) => dispatch(setUserBoxVisible(value)) },
            { ref: menuBoxRef, visible: menuBoxVisible, setVisible: (value) => dispatch(setMenuBoxVisible(value)) },
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
    }, [userBoxVisible, menuBoxVisible, notiBoxVisible, chatNotiBoxVisible, searchBoxVisible, dispatch]);

    return (
        <div className='headerNormal'>
            <div className='headerNormalLeft'>
                {searchBoxVisible ? (
                    <div ref={searchBoxRef}>
                        <SearchBox />
                    </div>
                ) : (
                    <>
                        <NavLink to={'/homepage'}>
                            <img src={fblogo} alt="" />
                        </NavLink>

                        <div className='searchContainer' onClick={(e) => { e.stopPropagation(); dispatch(setSearchBoxVisible(true)) }}>
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder='Search Facebook'
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="headerNormalMiddle">
                <NavLink to="/homepage" activeclassname="active">
                    {({ isActive }) => (isActive ? <HomeIcon /> : <HomeOutlinedIcon />)}
                </NavLink>
                <NavLink to="/friendpage" activeclassname="active">
                    {({ isActive }) => (isActive ? <PeopleAltIcon /> : <PeopleAltOutlinedIcon />)}
                </NavLink>
                <NavLink to="/videospage" activeclassname="active">
                    {({ isActive }) => (isActive ? <SmartDisplayIcon /> : <SmartDisplayOutlinedIcon />)}
                </NavLink>
                <NavLink to="/grouppage" activeclassname="active">
                    {({ isActive }) => (isActive ? <GroupsIcon /> : <GroupsOutlinedIcon />)}
                </NavLink>
            </div>

            <div className="headerNormalRight">
                <div className='headerNormalRightOption'>
                    <AppsIcon className='headerNormalRightOptionSvg' />
                </div>
                <div className="headerNormalRightOption" onClick={() => handleToggle(chatNotiBoxVisible, setChatNotiBoxVisible)} ref={msgBoxRef}>
                    <ForumIcon className='headerNormalRightOptionSvg' />
                    {chatNotification.length > 0 && <p id='msgLengthIcon'>{chatNotification.length}</p>}
                    {chatNotiBoxVisible && <MessageBox />}
                </div>
                <div className="headerNormalRightOption" onClick={() => handleToggle(notiBoxVisible, setNotiBoxVisible)} ref={notiBoxRef}>
                    <NotificationsIcon className='headerNormalRightOptionSvg' />
                    {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                    {notiBoxVisible && <NotificationBox />}
                </div>
                <div className="headerNormalRightOption" onClick={() => handleToggle(userBoxVisible, setUserBoxVisible)} ref={userBoxRef}>
                    <Avatar src={user.photoURL} className='headerNormalRightOptionImg' />
                    {userBoxVisible && <UserBox />}
                </div>
                <div className="headerNormalRightOption" onClick={() => handleToggle(menuBoxVisible, setMenuBoxVisible)} ref={menuBoxRef}>
                    <MenuIcon className='headerNormalRightOptionSvg' />
                    {menuBoxVisible && <MenuBox />}
                </div>
            </div>
        </div>
    );
}

export default HeaderNormal;