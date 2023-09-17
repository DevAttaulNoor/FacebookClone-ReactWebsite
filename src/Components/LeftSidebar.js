import '../CSS/LeftSidebar.css'
import React from 'react'
import { useStateValue } from './StateProvider';
import { Link } from 'react-router-dom';
import LeftSidebarOption from './LeftSidebarOption'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function LeftSidebar() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className='LeftSidebar'>
            <Link to="/userhomepage">
                <LeftSidebarOption src={user.photoURL} title={user.displayName} />
            </Link>
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png' title='Memories' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/G_tsqBLQpdP.png' title='Marketplace' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/eECk3ceTaHJ.png' title='Feeds' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/WMOYDeEqIYv.png' title='Events' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/ATlxuj_J5ty.png' title='Ads Manager' />
            <LeftSidebarOption src='https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/fNPcDZC-2PD.png' title='Crisis response' />
            <LeftSidebarOption Icon={ArrowDropDownIcon} title='See more' />
        </div>
    )
}

export default LeftSidebar