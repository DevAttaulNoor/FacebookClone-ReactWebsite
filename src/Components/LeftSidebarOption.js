import React from 'react'
import { Avatar, Icon } from '@mui/material'
import '../CSS/LeftSidebarOption.css'

function LeftSidebarOption(src, Icon, title) {
  return (
    <div className='leftsidebarRow'>
        {src && <Avatar src={src} />}
        {Icon && <Icon/> }
        <p>{title}</p>
    </div>
  )
}

export default LeftSidebarOption