import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/Sidebar_options.css'

function Sidebar_options({src, Icon, title}) {
  return (
    <div className='sidebarRow'>
        {src && <Avatar src={src} />}
        {Icon && <Icon /> }
        <p>{title}</p>
    </div>
  )
}

export default Sidebar_options