import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/LeftSidebaroptions.css'

function LeftSidebaroptions({src, Icon, title}) {
  return (
    <div className='leftSidebarRow'>
        <p id='LeftSidebarSvg'>{src && <Avatar src={src} />}</p>
        <p id='LeftSidebarIcon'>{Icon && <Icon /> }</p>
        <p id='LeftSidebarTitle'>{title}</p>
    </div>
  )
}

export default LeftSidebaroptions