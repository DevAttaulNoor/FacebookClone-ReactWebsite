import '../../CSS/HomePage/HomePage_Leftbar.css'
import React from 'react'
import { Link } from 'react-router-dom';
import { useStateValue } from '../BackendRelated/StateProvider';
import HomePage_Leftbar_Options from './HomePage_Leftbar_Options';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function HomePage_Leftbar() {
    const [{ user }] = useStateValue();

    return (
        <div className='homepage_Leftbar'>
            <Link to="/userhomepage">
                <HomePage_Leftbar_Options src={user.photoURL} title={user.displayName} />
            </Link>
            <Link to="/friendpage">
                <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends' />
            </Link>
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/G_tsqBLQpdP.png' title='Marketplace' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/eECk3ceTaHJ.png' title='Feeds' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png' title='Memories' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/WMOYDeEqIYv.png' title='Events' />
            {/* <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/ATlxuj_J5ty.png' title='Ads Manager' />
            <HomePage_Leftbar_Options src='https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/fNPcDZC-2PD.png' title='Crisis response' /> */}
            <HomePage_Leftbar_Options Icon={ArrowDropDownIcon} title='See more' />

            <div className='terms'>
                <p>Privacy</p>
                <p>Terms</p>
                <p>Advertising</p>
                <p>Ad choices</p>
                <p>Cookies</p>
                <p>Meta© 2023</p>
            </div>
        </div>
    )
}

export default HomePage_Leftbar 