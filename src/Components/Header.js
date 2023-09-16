import '../CSS/Header.css'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useStateValue } from './StateProvider';
import fblogo from '../Imgs/fblogo.png';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { auth } from './Firebase';

function Header() {
    const [{ user }, dispatch] = useStateValue();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);
    const location = useLocation();

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
        <div className='header'>
            <div className='header_left'>
                <img src={fblogo} alt="" />
                <div className='header_search'>
                    <SearchIcon />
                    <input type="text" placeholder='Search Facebook' />
                </div>
            </div>

            <div className="header_middle">
                <div className={`header_option ${location.pathname === '/' ? 'header_option_active' : ''}`}>
                    <Link to="/">
                        <HomeIcon />
                    </Link>
                </div>
                <div className='header_option'>
                    <Link to="/friendpage">
                        <PeopleIcon />
                    </Link>
                </div>
                <div className='header_option'>
                    <SmartDisplayIcon />
                </div>
                <div className='header_option'>
                    <StorefrontIcon />
                </div>
                <div className='header_option'>
                    <GroupsIcon />
                </div>
            </div>

            <div className="header_right">
                <IconButton>
                    <AppsIcon />
                </IconButton>
                <IconButton>
                    <ForumIcon />
                </IconButton>
                <IconButton>
                    <NotificationsIcon />
                </IconButton>
                <IconButton>
                    <div className={`header_rightAvatarBox ${isDialogVisible ? 'clicked' : ''}`}>
                        <Avatar src={user.photoURL} onClick={toggleDialog} ref={dialogBoxRef} />
                        {isDialogVisible && (
                            <div className="dialogBox">
                                <Link to="/homepage">
                                    <button>Home</button>
                                </Link>
                                <button>Settings</button>
                                <button onClick={handleSignOut}>Sign Out</button>
                            </div>
                        )}
                    </div>
                </IconButton>
            </div>
        </div>
    )
}

export default Header;