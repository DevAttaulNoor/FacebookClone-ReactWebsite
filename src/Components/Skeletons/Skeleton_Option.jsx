import '../../CSS/Skeletons/Skeleton_Option.css'
import React from 'react'
import Skeleton from './Skeleton'

function Skeleton_Option() {
    return (
        <div className='skeletonOption'>
            <Skeleton type='avatar' />
            <Skeleton type='title' />
        </div>
    )
}

export default Skeleton_Option