import '../../CSS/UserPage/UserpageComponentsVideos.css'
import React from 'react'
import UserpageVideos from './UserpageVideos'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

function UserpageComponentsVideos() {
    return (
        <div className="UserpageComponents_Videos">
            <div className="UserpageComponents_Videos_Top">
                <div className="UserpageComponents_Videos_TopLeft">
                    <h3>Videos</h3>
                </div>

                <div className="UserpageComponents_Videos_TopRight">
                    <p>Add videos</p>
                    <MoreHorizIcon className='moreOptions' />
                </div>
            </div>

            <div className="UserpageComponents_Videos_Middle">
                <UserpageVideos />
            </div>
        </div>
    )
}

export default UserpageComponentsVideos;