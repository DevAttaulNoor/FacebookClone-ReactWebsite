import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/LSidebar_options.css'

function LSidebar_options({src, Icon, title}) {
  return (
    <div className='leftSidebarRow'>
        <p id='LeftSidebarSvg'>{src && <Avatar src={src} />}</p>
        <p id='LeftSidebarIcon'>{Icon && <Icon /> }</p>
        <p id='LeftSidebarTitle'>{title}</p>
    </div>
  )
}

export default LSidebar_options