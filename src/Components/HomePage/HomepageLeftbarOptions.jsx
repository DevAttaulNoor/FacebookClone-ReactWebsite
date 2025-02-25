import '../../CSS/HomePage/HomepageLeftbarOptions.css'
import React from 'react'
import { Avatar } from '@mui/material'

function HomepageLeftbarOptions({ src, icon, title }) {
    return (
        <div className='homepageLeftbarOptions'>
            {icon ? icon : <Avatar src={src} />}
            <p>{title}</p>
        </div>
    )
}

export default HomepageLeftbarOptions