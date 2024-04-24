import '../../CSS/UserPage/UserpageComponentsAbout.css'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';

function UserpageComponentsAbout() {
    return (
        <div className="userpageComponentsAbout">
            <div className="userpageComponentsAbout_Left">
                <h3>About</h3>
                <p>Overview</p>
                <p>Work and education</p>
                <p>Places lived</p>
                <p>Contact and basic info</p>
                <p>Family and relationships</p>
                <p>Details About you</p>
                <p>Life events</p>
            </div>

            <div className="userpageComponentsAbout_Right">
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add a workplace</p>
                </div>
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add secondary school</p>
                </div>
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add university</p>
                </div>
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add current city</p>
                </div>
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add home town</p>
                </div>
                <div className='userpageComponentsAbout_RightOption'>
                    <AddIcon />
                    <p>Add a relationship status</p>
                </div>
            </div>
        </div>
    )
}

export default UserpageComponentsAbout;