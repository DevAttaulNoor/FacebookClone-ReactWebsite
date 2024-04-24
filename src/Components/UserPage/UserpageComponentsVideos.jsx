import '../../CSS/UserPage/UserpageComponentsVideos.css'
import React from 'react'
import UserpageVideos from './UserpageVideos'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

function UserpageComponentsVideos() {
    return (
        <div className="userpageComponentsVideos">
            <div className="userpageComponentsVideos_Top">
                <div className="userpageComponentsVideos_TopLeft">
                    <h3>Videos</h3>
                </div>

                <div className="userpageComponentsVideos_TopRight">
                    <p>Add videos</p>
                    <MoreHorizIcon className='moreOptions' />
                </div>
            </div>

            <div className="userpageComponentsVideos_Middle">
                <UserpageVideos />
            </div>
        </div>
    )
}

export default UserpageComponentsVideos;