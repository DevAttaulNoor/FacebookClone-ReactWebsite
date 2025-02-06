import '../../CSS/UniversalComponent/BookmarkPage.css'
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomepageLeftbarOptions from '../HomePage/HomepageLeftbarOptions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function BookmarkPage() {
    const user = useSelector((state) => state.data.user.user);

    return (
        <div className='bookmarkPage'>
            <NavLink to="/userhomepage/post">
                <HomepageLeftbarOptions src={user.photoURL} title={user.username} />
            </NavLink>

            <NavLink to="/friendpage">
                <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends' />
            </NavLink>

            <NavLink to="/videospage">
                <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
            </NavLink>

            <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />

            <NavLink to="/savedpage">
                <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
            </NavLink>

            <HomepageLeftbarOptions icon={<KeyboardArrowDownIcon />} title='See more' />

            <div className='terms'>
                <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
            </div>
        </div>
    )
}

export default BookmarkPage