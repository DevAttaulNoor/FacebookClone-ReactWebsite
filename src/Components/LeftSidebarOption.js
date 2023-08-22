import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/LeftSidebarOption.css'

function LeftSidebarOption({src, Icon, title}) {
  return (
    <div className='LeftsidebarRow'>
        {src && <Avatar src={src} />}
        {Icon && <Icon /> }
        <p>{title}</p>
    </div>
  )
}

export default LeftSidebarOption