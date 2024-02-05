import '../../CSS/HomePage/HomePage_Leftbar.css'
import React from 'react'
import { NavLink } from 'react-router-dom';
import { useStateValue } from '../BackendRelated/StateProvider';
import HomePage_Leftbar_Options from './HomePage_Leftbar_Options';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function HomePage_Leftbar() {
    const [{ user }] = useStateValue();

    return (
        <div className='homePageLeftbar'>
            <NavLink to="/userhomepage">
                <HomePage_Leftbar_Options src={user.photoURL} title={user.username} />
            </NavLink>

            <NavLink to="/friendpage">
                <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends' />
            </NavLink>

            <NavLink to="/videospage">
                <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
            </NavLink>

            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/G_tsqBLQpdP.png' title='Marketplace' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/eECk3ceTaHJ.png' title='Feeds' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png' title='Memories' />

            <NavLink to="/savedpage">
                <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
            </NavLink>

            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/qfMB40PdgWb.png' title='Events' />
            {/* <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/ATlxuj_J5ty.png' title='Ads Manager' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/fNPcDZC-2PD.png' title='Crisis response' /> */}
            <HomePage_Leftbar_Options Icon={ArrowDropDownIcon} title='See more' />

            <div className='terms'>
                <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
            </div>
        </div>
    )
}

export default HomePage_Leftbar