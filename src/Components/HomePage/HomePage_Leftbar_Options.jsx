import '../../CSS/HomePage/HomePage_Leftbar_Options.css'
import React from 'react'
import { Avatar, Icon } from '@mui/material'

function HomePage_Leftbar_Options({ src, Icon, title }) {
    return (
        <div className='homepage_leftbarOptions'>
            {src && <Avatar src={src} />}
            {Icon && <Icon />}
            <p>{title}</p>
        </div>
    )
}

export default HomePage_Leftbar_Options