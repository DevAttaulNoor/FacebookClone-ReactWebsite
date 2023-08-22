import { Avatar, Icon } from '@mui/material'
import React from 'react'
import '../CSS/Leftsidebaroptions.css'

function Leftsidebaroptions({src, Icon, title}) {
  return (
    <div className='leftsidebarRow'>
        {src && <Avatar src={src} />}
        {Icon && <Icon /> }
        <p>{title}</p>
    </div>
  )
}

export default Leftsidebaroptions