import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/Sidebar_options.css'

function Sidebar_options({src, Icon, title}) {
  return (
    <div className='sidebarRow'>
        <p id='sidebarSvg'>{src && <Avatar src={src} />}</p>
        <p id='sidebarIcon'>{Icon && <Icon /> }</p>
        <p id='sidebarTitle'>{title}</p>
    </div>
  )
}

export default Sidebar_options