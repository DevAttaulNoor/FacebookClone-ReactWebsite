import '../../CSS/HomePage/HomePage_Rightbar_GroupsList.css'
import React, { useEffect, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '../Skeletons/Skeleton';
import Skeleton_Option from '../Skeletons/Skeleton_Option';

function HomePage_Rightbar_GroupsList() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='homepage_rightbar_groupslist'>
            {isLoading ? (
                <div>
                    <Skeleton type='fullText' />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                </div>
            ) : (
                <>
                    <div className="homepage_rightbar_groupslistTop">
                        <div className="homepage_rightbar_groupslistTopLeft">
                            <h4>Group conversations</h4>
                        </div>
                        <div className="homepage_rightbar_groupslistTopRight">
                            <MoreHorizIcon />
                        </div>
                    </div>

                    <div className="homepage_rightbar_groupslistBody">
                        <div className="homepage_rightbar_groupslistBodyOptions">
                            <AddIcon />
                            <p>Create New Group</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default HomePage_Rightbar_GroupsList