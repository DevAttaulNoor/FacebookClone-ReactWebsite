import '../CSS/LeftSidebarOption.css'
import React from 'react'
import { Avatar, Icon } from '@mui/material'

function LeftSidebarOption({ src, Icon, title }) {
    return (
        <div className='LeftsidebarRow'>
            {src && <Avatar src={src} />}
            {Icon && <Icon />}
            <p>{title}</p>
        </div>
    )
}

export default LeftSidebarOption