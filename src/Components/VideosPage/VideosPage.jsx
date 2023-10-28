import '../../CSS/VideosPage/VideosPage.css'
import React from 'react'
import VideosPage_Leftbar from './VideosPage_Leftbar'
import VideosPage_Main from './VideosPage_Main'

function VideosPage() {
    return (
        <div className='videosPage'>
            <div className="videosPage_Leftbar">
                <VideosPage_Leftbar/>
            </div>

            <div className="videosPage_Main">
                <VideosPage_Main/>
            </div>
        </div>
    )
}

export default VideosPage