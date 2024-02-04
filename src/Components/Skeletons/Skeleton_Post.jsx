import React from 'react'
import Skeleton_UserInfo from './Skeleton_UserInfo'
import Skeleton from './Skeleton'

function Skeleton_Post() {
    return (
        <div className='skeletonPost'>
            <Skeleton_UserInfo />
            <Skeleton type='text' />
            <Skeleton type='square' />
            <div className='skeletonPost_Bottom'>
                <Skeleton type='text' />
                <Skeleton type='text' />
                <Skeleton type='text' />
            </div>
        </div>
    )
}

export default Skeleton_Post