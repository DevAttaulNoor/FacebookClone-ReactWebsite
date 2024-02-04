import '../../CSS/Skeletons/Skeleton_UserInfo.css'
import React from 'react'
import Skeleton from './Skeleton'

function Skeleton_UserInfo() {
    return (
        <div className='skeletonsUserInfo'>
            <div className='skeletonsUserInfo_Left'>
                <Skeleton type='avatar' />
            </div>
            <div className='skeletonsUserInfo_Right'>
                <Skeleton type='halfhalfText' />
                <Skeleton type='halfhalfText' />
            </div>
        </div>
    )
}

export default Skeleton_UserInfo