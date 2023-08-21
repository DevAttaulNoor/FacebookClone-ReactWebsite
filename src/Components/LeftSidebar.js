import React from 'react'
import LeftSidebaroptions from './LeftSidebaroptions'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../CSS/LeftSidebar.css'

function LeftSidebar() {
  return (
    <div className='LeftSidebar'>
        <LeftSidebaroptions src='https://media.licdn.com/dms/image/C4E03AQG0HcVoiR1-TA/profile-displayphoto-shrink_800_800/0/1649081167717?e=2147483647&v=beta&t=epvWpYY1NFwvj2VvLAzgeBWzQhAwyLYmssen-VIfJU8' title='Atta ul Noor'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png' title='Memories'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/G_tsqBLQpdP.png' title='Marketplace'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/eECk3ceTaHJ.png' title='Feeds'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/WMOYDeEqIYv.png' title='Events'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/ATlxuj_J5ty.png' title='Ads Manager'/>
        <LeftSidebaroptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/fNPcDZC-2PD.png' title='Crisis response'/>
        <LeftSidebaroptions Icon={ArrowDropDownIcon} title='See more'/>
    </div>
  )
}

export default LeftSidebar