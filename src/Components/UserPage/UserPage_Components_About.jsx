import React from 'react'
import { useStateValue } from '../BackendRelated/StateProvider'

function UserPage_Components_About() {
    const [{user}] = useStateValue()

    return (
        <div className="UserpageComponents_About">
            <div className="UserpageComponents_About_Left">
                <p>Overview</p>
                <p>Work and education</p>
                <p>Places lived</p>
                <p>Contact and basic info</p>
                <p>Family and relationships</p>
                <p>`Details About ${user.username}`</p>
                <p>Life events</p>
            </div>

            <div className="UserpageComponents_About_Right">
                <p>No workplace to show</p>
                <p>No education to show</p>
                <p>No residency to show</p>
                <p>No location to show</p>
                <p>No relationship info to show</p>
            </div>
        </div>
    )
}

export default UserPage_Components_About