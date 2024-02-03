import '../../CSS/Skeletons/Skeleton.css'
import React from 'react'

function Skeleton({ type }) {
    const classes = `skeleton ${type}`;
    return (
        <div className={classes}></div>
    )
}

export default Skeleton