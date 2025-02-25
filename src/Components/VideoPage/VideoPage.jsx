import '../../CSS/VideoPage/VideoPage.css'
import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom';
import VideopageHome from './VideopageHome';
import VideopageSaved from './VideopageSaved';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

function VideoPage() {
    return (
        <div className='videoPage'>
            <div className='videoPageLeftbar'>
                <div className="videoPageLeftbarTop">
                    <p>Video</p>
                    <SettingsIcon />
                </div>

                <div className="videoPageLeftbarBottom">
                    <NavLink to="/videopage/" activeclassname="active">
                        <div className="videoPageLeftbarBottomOption">
                            <SmartDisplayIcon />
                            <p>Home</p>
                        </div>
                    </NavLink>
                    <NavLink to="/videopage/saved" activeclassname="active">
                        <div className="videoPageLeftbarBottomOption">
                            <div className='MuiSvgIcon-root'><i id='savePostIcon'></i></div>
                            <p>Saved</p>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='videoPageMain'>
                <Routes>
                    <Route path="/" element={<VideopageHome />} />
                    <Route path="/saved" element={<VideopageSaved />} />
                </Routes>
            </div>
        </div>
    )
}

export default VideoPage