import '../../CSS/VideosPage/VideosPage_Leftbar.css'
import React from 'react'
import { NavLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

function VideosPage_Leftbar() {
    return (
        <div className='videosPageLeftbar'>
            <div className="videosPageLeftbar_Top">
                <p>Video</p>
                <SettingsIcon />
            </div>

            <div className="videosPageLeftbar_Bottom">
                <NavLink to="/videospage/" activeClassName="active">
                    <div className="videosPageLeftbar_BottomOptions">
                        <div className="videosPageLeftbar_BottomOption">
                            <SmartDisplayIcon />
                            <p>Home</p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default VideosPage_Leftbar