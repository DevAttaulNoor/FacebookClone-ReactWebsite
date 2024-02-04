import React from 'react'
import Skeleton from './Skeleton'

function Skeleton_UserInfo() {
    return (
        <div className='skeletonsUserInfo'>
            <div className='skeletonsUserInfo_Left'>
                <Skeleton type='avatar' />
            </div>
            <div className='skeletonsUserInfo_Right'>
                <Skeleton type='title' />
                <Skeleton type='text' />
            </div>
        </div>
    )
}

export default Skeleton_UserInfo