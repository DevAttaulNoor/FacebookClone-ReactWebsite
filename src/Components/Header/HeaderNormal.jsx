import '../../CSS/Header/HeaderNormal.css'
import fblogo from '../../Assets/Images/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBoxVisible } from '../../Redux/searchSlice';
import { setChatNotiBoxVisible, setNotiBoxVisible } from '../../Redux/notificationSlice';
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

function HeaderNormal() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const allNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const notiBoxVisible = useSelector((state) => state.data.notification.notiBoxVisible);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const chatNotiBoxVisible = useSelector((state) => state.data.notification.chatNotiBoxVisible);
    const searchBoxVisible = useSelector((state) => state.data.search.searchBoxVisible);
    const [userBoxVisible, setUserBoxVisible] = useState(false);
    const userBoxRef = useRef(null);
    const searchBoxRef = useRef(null);
    const messageBoxRef = useRef(null);
    const notificationBoxRef = useRef(null);

    const toggleUserBox = () => {
        setUserBoxVisible(!userBoxVisible);
    };

    const toggleNotificationBox = () => {
        dispatch(setNotiBoxVisible(!notiBoxVisible));
    };

    const toggleMessageBox = () => {
        dispatch(setChatNotiBoxVisible(!chatNotiBoxVisible));
    };

    useEffect(() => {
        const boxes = [
            { ref: userBoxRef, visible: userBoxVisible, setVisible: setUserBoxVisible },
            { ref: notificationBoxRef, visible: notiBoxVisible, setVisible: (value) => dispatch(setNotiBoxVisible(value)) },
            { ref: messageBoxRef, visible: chatNotiBoxVisible, setVisible: (value) => dispatch(setChatNotiBoxVisible(value)) },
            { ref: searchBoxRef, visible: searchBoxVisible, setVisible: (value) => dispatch(setSearchBoxVisible(value)) },
        ];
    
        const handleOutsideClick = (e) => {
            boxes.forEach(({ ref, visible, setVisible }) => {
                if (ref.current && !ref.current.contains(e.target) && visible) {
                    setVisible(false);
                }
            });
        };
    
        window.addEventListener("click", handleOutsideClick);
    
        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [userBoxVisible, notiBoxVisible, chatNotiBoxVisible, searchBoxVisible, dispatch]);

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

                        <div className='searchContainer' onClick={(e) => { e.stopPropagation(); dispatch(setSearchBoxVisible(true))}}>
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
                    {({ isActive }) => (
                        isActive ? <HomeIcon /> : <HomeOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/friendpage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <PeopleAltIcon /> : <PeopleAltOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/videospage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <SmartDisplayIcon /> : <SmartDisplayOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/grouppage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <GroupsIcon /> : <GroupsOutlinedIcon />
                    )}
                </NavLink>
            </div>

            <div className="headerNormalRight">
                <div className='headerNormalRightOption'>
                    <AppsIcon className='headerNormalRightOptionSvg' />
                </div>

                <div className="headerNormalRightOption">
                    <ForumIcon className='headerNormalRightOptionSvg' onClick={toggleMessageBox} ref={messageBoxRef} />
                    {chatNotification.length > 0 && <p id='msgLengthIcon'>{chatNotification.length}</p>}
                    {chatNotiBoxVisible && <MessageBox />}
                </div>

                <div className="headerNormalRightOption">
                    <NotificationsIcon className='headerNormalRightOptionSvg' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                    {notiBoxVisible && <NotificationBox />}
                </div>

                <div className="headerNormalRightOption">
                    <Avatar src={user.photoURL} className='headerNormalRightOptionImg' onClick={toggleUserBox} ref={userBoxRef} />
                    {userBoxVisible && <UserBox />}
                </div>
            </div>
        </div>
    );
}

export default HeaderNormal