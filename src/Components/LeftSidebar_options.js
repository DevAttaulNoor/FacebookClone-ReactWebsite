import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/LeftSidebar_options.css'

function LeftSidebar_options({src, Icon, title}) {
  return (
    <div className='leftSidebarRow'>
        <p id='LeftSidebarSvg'>{src && <Avatar src={src} />}</p>
        <p id='LeftSidebarIcon'>{Icon && <Icon /> }</p>
        <p id='LeftSidebarTitle'>{title}</p>
    </div>
  )
}

export default LeftSidebar_options