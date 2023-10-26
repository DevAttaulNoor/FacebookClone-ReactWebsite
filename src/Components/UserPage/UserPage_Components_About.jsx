import '../../CSS/UserPage/UserPage_Components_About.css'
import React from 'react'
import { useStateValue } from '../BackendRelated/StateProvider'
import AddIcon from '@mui/icons-material/Add';

function UserPage_Components_About() {
    // const [{ user }] = useStateValue()

    return (
        <div className="UserpageComponents_About">
            <div className="UserpageComponents_About_Left">
                <h3>About</h3>
                <p>Overview</p>
                <p>Work and education</p>
                <p>Places lived</p>
                <p>Contact and basic info</p>
                <p>Family and relationships</p>
                <p>Details About you</p>
                <p>Life events</p>
            </div>

            <div className="UserpageComponents_About_Right">
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add a workplace</p>
                </div>
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add secondary school</p>
                </div>
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add university</p>
                </div>
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add current city</p>
                </div>
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add home town</p>
                </div>
                <div className='UserpageComponents_About_RightOption'>
                    <AddIcon />
                    <p>Add a relationship status</p>
                </div>
            </div>
        </div>
    )
}

export default UserPage_Components_About