import '../../CSS/SavedPage/SavedPage_Leftbar.css'
import React from 'react'
import { NavLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

function SavedPage_Leftbar() {
    return (
        <div className='savedPageLeftbar'>
            <div className="savedPageLeftbar_Top">
                <p>Saved</p>
                <SettingsIcon />
            </div>

            <div className="savedPageLeftbar_Bottom">
                <NavLink to="/savedpage/" activeClassName="active">
                    <div className="savedPageLeftbar_BottomOptions">
                        <div className="savedPageLeftbar_BottomOption">
                            <SmartDisplayIcon />
                            <p>For later</p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default SavedPage_Leftbar