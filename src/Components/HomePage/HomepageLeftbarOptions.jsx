import '../../CSS/HomePage/HomepageLeftbarOptions.css'
import React from 'react'
import { Avatar } from '@mui/material'

function HomepageLeftbarOptions({ src, icon, title }) {
    return (
        <div className='homepageLeftbarOptions'>
            {src && <Avatar src={src} />}
            {icon && icon}
            <p>{title}</p>
        </div>
    )
}

export default HomepageLeftbarOptions