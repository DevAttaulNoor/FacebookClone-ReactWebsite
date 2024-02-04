import '../../CSS/Skeletons/Skeleton_Post.css'
import React from 'react'
import Skeleton_UserInfo from './Skeleton_UserInfo'
import Skeleton from './Skeleton'

function Skeleton_Post() {
    return (
        <div className='skeletonPost'>
            <Skeleton_UserInfo />
            <Skeleton type='square' />
            <div className='skeletonPost_Bottom'>
                <Skeleton type='halfText' />
                <Skeleton type='halfText' />
                <Skeleton type='halfText' />
            </div>
        </div>
    )
}

export default Skeleton_Post