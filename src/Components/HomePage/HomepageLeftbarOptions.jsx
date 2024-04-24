import '../../CSS/HomePage/HomepageLeftbarOptions.css'
import React from 'react'
import { Avatar, Icon } from '@mui/material'

function HomepageLeftbarOptions({ src, Icon, title }) {
    return (
        <div className='homepageLeftbarOptions'>
            {src && <Avatar src={src} />}
            {Icon && <Icon />}
            <p>{title}</p>
        </div>
    )
}

export default HomepageLeftbarOptions