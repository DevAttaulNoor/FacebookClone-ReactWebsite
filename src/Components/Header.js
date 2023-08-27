import React from 'react'
import '../CSS/Header.css'
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
// import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';

import fblogo from '../Imgs/fblogo.png';
import { useStateValue } from './StateProvider';


function Header() {
    const [{user}, dispatch] = useStateValue();

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
                    <Avatar src={user.photoURL}/>
                    {/* <h5>{user.displayName}</h5> */}
                </IconButton>
            </div>
        </div>
    )
}

export default Header;