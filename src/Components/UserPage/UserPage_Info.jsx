import "../../CSS/UserPage/UserPage_Info.css"
import React from 'react'

function UserPage_Info() {
    return (
        <div className='userpage_Info'>
            <h2>Intro</h2>
            <div className="introBio">
                <h4 id='bio'>Bio</h4>
                <button>Edit bio</button>
            </div>
            <div className="introInfo">
                <h5>University</h5>
                <h5>College</h5>
                <h5>School</h5>
                <h5>Location</h5>
                <h5>Joining Date</h5>
            </div>
            <button>Edit Details</button>
            <button>Add hobbies</button>
            <button>Add featured</button>
        </div>
    )
}

export default UserPage_Info