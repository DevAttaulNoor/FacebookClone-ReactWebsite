import '../../CSS/Header/HeaderNormal.css'
import fblogo from '../../Assets/Images/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChatNotiBoxVisible, setNotiBoxVisible } from '../../Redux/notificationSlice';
import { db } from '../../Firebase/firebase';
import UserBox from './UserBox';
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
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';

function HeaderNormal() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const notification = useSelector((state) => state.data.notification.notification);
    const allNotification = notification.filter(notification => notification.notificationStatus === 'notseen');
    const notiBoxVisible = useSelector((state) => state.data.notification.notiBoxVisible);
    const chatNotification = useSelector((state) => state.data.notification.chatNotification);
    const chatNotiBoxVisible = useSelector((state) => state.data.notification.chatNotiBoxVisible);
    const userBoxRef = useRef(null);
    const messageBoxRef = useRef(null);
    const notificationBoxRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [userBoxVisible, setUserBoxVisible] = useState(false);

    const toggleUserBox = () => {
        setUserBoxVisible(!userBoxVisible);
    };

    const toggleNotificationBox = () => {
        dispatch(setNotiBoxVisible(!notiBoxVisible));
    };

    const toggleMessageBox = () => {
        dispatch(setChatNotiBoxVisible(!chatNotiBoxVisible));
    };

    const handleSearchBoxVisibility = (userId) => {
        setSearchText('');
        setSelectedUser(userId);
        setIsSearchBoxVisible(false);
    }

    // const handleSearchInput = () => {
    //     setIsSearchBoxVisible(!isSearchBoxVisible);
    // };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
                setUserBoxVisible(false);
            }

            if (notificationBoxRef.current && !notificationBoxRef.current.contains(e.target)) {
                dispatch(setNotiBoxVisible(false));
            }

            if (messageBoxRef.current && !messageBoxRef.current.contains(e.target)) {
                dispatch(setChatNotiBoxVisible(false));
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [userBoxRef, notificationBoxRef, messageBoxRef]);

    // useEffect(() => {
    //     const handleOutsideClick = (e) => {
    //         if (
    //             isSearchBoxVisible &&
    //             !document.querySelector(".searchContainer").contains(e.target)
    //         ) {
    //             setSearchText('');
    //             setIsSearchBoxVisible(false);
    //         }
    //     };

    //     window.addEventListener("click", handleOutsideClick);

    //     // Cleanup the event listener when the component unmounts
    //     return () => {
    //         window.removeEventListener("click", handleOutsideClick);
    //     };
    // }, [isSearchBoxVisible]);

    useEffect(() => {
        if (searchText === '') {
            setMatchingUsernames([]);
            return;
        }

        db.collection("Users")
            .get()
            .then((querySnapshot) => {
                const matchingUsernames = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            Uid: data.Uid,
                            username: data.username,
                            photoURL: data.photoURL,
                        };
                    })
                    .filter((user) =>
                        user.username.toLowerCase().includes(searchText.toLowerCase())
                    );
                setMatchingUsernames(matchingUsernames);
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    }, [searchText]);

    return (
        <div className='headerNormal'>
            <div className='headerNormalLeft'>
                {isSearchBoxVisible ? (
                    <>
                        <div className="searchBox">
                            <div className="searchBoxTop">
                                <div className='svgBox' onClick={() => setIsSearchBoxVisible(false)}>
                                    <KeyboardBackspaceIcon />
                                </div>

                                <input
                                    type="text"
                                    placeholder='Search Facebook'
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className="searchBoxBottom">
                                {matchingUsernames.length > 0 ? (
                                    matchingUsernames.map((user) => (
                                        <div className='searchBoxBottomOption' key={user.id} onClick={() => handleSearchBoxVisibility(user.id)}>
                                            <NavLink to={`/frienduserpage/${user.id}`}>
                                                <Avatar src={user.photoURL} />
                                                <p>{user.username}</p>
                                            </NavLink>
                                        </div>
                                    ))
                                ) : (
                                    <p id='noMatch'>No match found</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <NavLink to={'/homepage'}>
                            <img src={fblogo} alt="" />
                        </NavLink>

                        <div className='searchContainer' onClick={() => setIsSearchBoxVisible(true)}>
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

                <div className={`headerNormalRightOption ${chatNotiBoxVisible ? 'clicked' : ''}`}>
                    <ForumIcon className='headerNormalRightOptionSvg' onClick={toggleMessageBox} ref={messageBoxRef} />
                    {chatNotification.length > 0 && <p id='msgLengthIcon'>{chatNotification.length}</p>}
                    {chatNotiBoxVisible && <MessageBox />}
                </div>

                <div className={`headerNormalRightOption ${notiBoxVisible ? 'clicked' : ''}`}>
                    <NotificationsIcon className='headerNormalRightOptionSvg' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                    {notiBoxVisible && <NotificationBox />}
                </div>

                <div className={`headerNormalRightOption ${userBoxVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} className='headerNormalRightOptionImg' onClick={toggleUserBox} ref={userBoxRef} />
                    {userBoxVisible && <UserBox />}
                </div>
            </div>
        </div>
    );
}

export default HeaderNormal