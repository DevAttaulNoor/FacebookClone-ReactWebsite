import '../../CSS/Skeletons/Skeleton_HomePage.css'
import React from 'react'
import Skeleton from './Skeleton'
import Skeleton_Option from './Skeleton_Option'
import Skeleton_Post from './Skeleton_Post'

function Skeleton_HomePage() {
    return (
        <div className='skeletonHomePage'>
            <div className="skeletonHomePage_Top">
                <div className='skeletonHomePage_TopLeft'>
                    <Skeleton type='avatar' />
                    <Skeleton type='title' />
                </div>

                <div className='skeletonHomePage_TopMiddle'>
                    <Skeleton type='smallSquare' />
                    <Skeleton type='smallSquare' />
                    <Skeleton type='smallSquare' />
                    <Skeleton type='smallSquare' />
                </div>

                <div className='skeletonHomePage_TopRight'>
                    <Skeleton type='avatar' />
                    <Skeleton type='avatar' />
                    <Skeleton type='avatar' />
                    <Skeleton type='avatar' />
                </div>
            </div>

            <div className="skeletonHomePage_Content">
                <div className='Leftbar'>
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton type='fullText' />
                    <Skeleton type='halfhalfText' />
                </div>

                <div className='Middle'>
                    <div className='post'>
                        <Skeleton_Post />
                        <Skeleton_Post />
                    </div>
                </div>

                <div className='Rightbar'>
                    <div className="Rightbar_Friendlist">
                        <Skeleton type='fullText' />
                        <Skeleton_Option />
                        <Skeleton_Option />
                        <Skeleton_Option />
                        <Skeleton_Option />
                    </div>

                    <div className="Rightbar_Grouplist">
                        <Skeleton type='fullText' />
                        <Skeleton_Option />
                        <Skeleton_Option />
                        <Skeleton_Option />
                        <Skeleton_Option />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skeleton_HomePage