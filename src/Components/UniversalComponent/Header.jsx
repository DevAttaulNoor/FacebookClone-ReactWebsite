import '../../CSS/UniversalComponent/Header.css'
import fblogo from '../../Imgs/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { auth } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

function Header() {
    const [{ user }, dispatch] = useStateValue();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);
    const location = useLocation();
    const friendPages = ['/friendpage', '/friendpage/', '/friendpage/allFriends', '/friendpage/friendReqs'];
    const friendPagesActive = friendPages.some((page) => location.pathname === page);

    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(location.pathname);

    // Check if the current location matches any of the active pages


    const handleSignOut = () => {
        sessionStorage.removeItem('userData');
        sessionStorage.setItem('userLoggedOut', 'true');

        auth.signOut()
            .then(() => {
                sessionStorage.removeItem('userData');

                // Set the user to null to indicate they are signed out
                dispatch({
                    type: "SET_USER",
                    user: null,
                });
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(e.target)) {
                setIsDialogVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className={`header ${showHeader ? '' : 'transformed'}`}>
            <div className='Transformed_header_left'>
                <Link to={'/homepage'}>
                    <CloseIcon className='closeIcon' />
                    <img src={fblogo} alt="" />
                </Link>
            </div>

            <div className='header_left'>
                <Link to={'/homepage'}>
                    <img src={fblogo} alt="" />
                </Link>
                <div className='header_search'>
                    <SearchIcon />
                    <input type="text" placeholder='Search Facebook' />
                </div>
            </div>

            <div className="header_middle">
                <Link to="/homepage">
                    <div className={`header_option ${location.pathname === '/homepage' ? 'header_option_active' : ''}`}>
                        <HomeIcon />
                    </div>
                </Link>
                <Link to="/friendpage">
                    <div className={`header_option ${friendPagesActive ? 'header_option_active' : ''}`}>
                        <PeopleIcon />
                    </div>
                </Link>
                <div className='header_option'>
                    <SmartDisplayIcon />
                </div>
                <div className='header_option'>
                    <GroupsIcon />
                </div>
            </div>

            <div className="header_right">
                <AppsIcon />
                <ForumIcon id='msgIcon' />
                <NotificationsIcon />

                <div className={`header_rightAvatarBox ${isDialogVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} onClick={toggleDialog} ref={dialogBoxRef} />
                    {isDialogVisible && (
                        <div className="dialogBox">
                            <Link to="/userhomepage">
                                <button>Home</button>
                            </Link>
                            <button>Settings</button>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;