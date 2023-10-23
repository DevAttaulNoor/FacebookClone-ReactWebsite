import '../../CSS/UserPage/UserPage_Components_Friends.css'
import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function UserPage_Components_Friends() {
    return (
        <div className="UserpageComponents_Friends">
            <div className="UserpageComponents_Friends_Top">
                <div className="UserpageComponents_Friends_TopLeft">
                    <h3>Friends</h3>
                </div>
                <div className="UserpageComponents_Friends_TopRight">
                    <p>Friends requests</p>
                    <p>Find Friends</p>
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="UserpageComponents_Friends_Middle">
                <div className='UserpageComponents_Friends_MiddleOptions'>
                    <div className='UserpageComponents_Friends_MiddleOption'>
                        <div className="UserpageComponents_Friends_MiddleOptionLeft">
                            <img src="" alt="" />

                        </div>
                        <div className="UserpageComponents_Friends_MiddleOptionRight">
                            <p>Name</p>
                            <p>Intro</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage_Components_Friends