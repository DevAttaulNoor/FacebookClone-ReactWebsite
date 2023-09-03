import '../CSS/Header.css'
import React, { useState } from 'react'
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

import { auth } from './Firebase';

function Header() {
    const [{ user }, dispatch] = useStateValue();
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                // Sign-out successful, update user state
                dispatch({
                    type: "SET_USER",
                    user: null, // Set the user to null to indicate they are signed out
                });
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    // Function to toggle the dialog visibility
    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
    };

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
                <div className='header_option header_option_active'>
                    <HomeIcon />
                </div>
                <div className='header_option'>
                    <PeopleIcon />
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
                    {/* Avatar */}
                    <div className={`header_rightId ${isDialogVisible ? 'clicked' : ''}`}>
                        <Avatar src={user.photoURL} onClick={toggleDialog} />

                        {isDialogVisible && (
                            <div className="dialogBox">
                                <button onClick={handleSignOut}>Sign Out</button>
                                {/* You can add more options in the dialog box */}
                            </div>
                        )}
                    </div>
                </IconButton>
            </div>
        </div>
    )
}

export default Header;