import '../../CSS/UniversalComponent/Header.css'
import fblogo from '../../Assets/Images/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Redux/userSlice';
import { setChatNotiBoxVisible, setNotiBoxVisible } from '../../Redux/notificationSlice';
import { auth, db } from '../../Firebase/firebase';
import UserBox from './UserBox';
import MessageBox from './MessageBox';
import NotificationBox from './NotificationBox';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

function Header() {
    const navigate = useNavigate();
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
    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

    const toggleUserBox = () => {
        setUserBoxVisible(!userBoxVisible);
    };

    const toggleNotificationBox = () => {
        dispatch(setNotiBoxVisible(!notiBoxVisible));
    };

    const toggleMessageBox = () => {
        dispatch(setChatNotiBoxVisible(!chatNotiBoxVisible));
    };

    const handleSearchInput = () => {
        setIsSearchBoxVisible(!isSearchBoxVisible);
    };

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

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                isSearchBoxVisible &&
                !document.querySelector(".searchContainer").contains(e.target)
            ) {
                setIsSearchBoxVisible(false);
                setSearchText('');
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [isSearchBoxVisible]);

    useEffect(() => {
        if (searchText === '') {
            // Reset matching usernames when search input is empty
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
        <div className={`header ${showHeader ? '' : 'transformed'}`}>
            <div className='headerTransformedLeft'>
                <NavLink to={'/homepage'}>
                    <CloseIcon className='closeIcon' />
                    <img src={fblogo} alt="" />
                </NavLink>
            </div>

            <div className='headerLeft'>
                <NavLink to={'/homepage'}>
                    <img src={fblogo} alt="" />
                </NavLink>

                <div className='searchContainer'>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder='Search Facebook'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onClick={handleSearchInput}
                    />
                    {isSearchBoxVisible && (
                        <div className="searchContainerDropbox">
                            {matchingUsernames.length === 0 ? (
                                <p>No matches</p>
                            ) : (
                                matchingUsernames.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`searchContainerDropboxResults ${selectedUser === user.id ? "selected" : ""}`}
                                        onClick={() => {
                                            setSelectedUser(user.id);
                                            setIsSearchBoxVisible(false);
                                            setSearchText('');
                                        }}
                                    >
                                        <NavLink to={`/frienduserpage/${user.id}`}>
                                            <Avatar src={user.photoURL} />
                                            <p>{user.username}</p>
                                        </NavLink>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="headerMiddle">
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

            <div className="headerRight">
                <div className='headerRightOption'>
                    <AppsIcon className='headerRightOptionSvg' />
                </div>

                <div className={`headerRightOption ${chatNotiBoxVisible ? 'clicked' : ''}`}>
                    <ForumIcon className='headerRightOptionSvg' onClick={toggleMessageBox} ref={messageBoxRef} />
                    {chatNotification.length > 0 && <p id='msgLengthIcon'>{chatNotification.length}</p>}
                    {chatNotiBoxVisible && <MessageBox />}
                </div>

                <div className={`headerRightOption ${notiBoxVisible ? 'clicked' : ''}`}>
                    <NotificationsIcon className='headerRightOptionSvg' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {allNotification.length > 0 && <p id='notiLengthIcon'>{allNotification.length}</p>}
                    {notiBoxVisible && <NotificationBox />}
                </div>

                <div className={`headerRightOption ${userBoxVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} className='headerRightOptionImg' onClick={toggleUserBox} ref={userBoxRef} />
                    {userBoxVisible && <UserBox />}
                </div>
            </div>
        </div>
    );
}

export default Header