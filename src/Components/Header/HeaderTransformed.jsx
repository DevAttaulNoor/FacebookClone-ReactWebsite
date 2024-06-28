import '../../CSS/Header/HeaderTransformed.css';
import fblogo from '../../Assets/Images/fblogo.png';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotiBoxVisible } from '../../Redux/notificationSlice';
import UserBox from './UserBox';
import NotificationBox from './NotificationBox';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

function HeaderTransformed({ backgroundColor }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const allNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const notiBoxVisible = useSelector((state) => state.data.notification.notiBoxVisible);
    const userBoxRef = useRef(null);
    const notificationBoxRef = useRef(null);
    const [userBoxVisible, setUserBoxVisible] = useState(false);

    const toggleUserBox = () => {
        setUserBoxVisible(!userBoxVisible);
    };

    const toggleNotificationBox = () => {
        dispatch(setNotiBoxVisible(!notiBoxVisible));
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
                setUserBoxVisible(false);
            }

            if (notificationBoxRef.current && !notificationBoxRef.current.contains(e.target)) {
                dispatch(setNotiBoxVisible(false));
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [userBoxRef, notificationBoxRef, dispatch]);

    return (
        <div className='headerTransformed' style={{ backgroundColor }}>
            <div className='headerTransformedLeft'>
                <NavLink to={'/homepage'}>
                    <CloseIcon className='closeIcon' />
                </NavLink>

                <NavLink to={'/homepage'}>
                    <img src={fblogo} alt="" />
                </NavLink>
            </div>

            <div className="headerTransformedRight">
                <div className='headerTransformedRightOption'>
                    <AppsIcon className='headerTransformedRightOptionSvg' />
                </div>

                <div className={`headerTransformedRightOption ${notiBoxVisible ? 'clicked' : ''}`}>
                    <NotificationsIcon className='headerTransformedRightOptionSvg' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                    {notiBoxVisible && <NotificationBox />}
                </div>

                <div className={`headerTransformedRightOption ${userBoxVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} className='headerTransformedRightOptionImg' onClick={toggleUserBox} ref={userBoxRef} />
                    {userBoxVisible && <UserBox />}
                </div>
            </div>
        </div>
    )
}

export default HeaderTransformed