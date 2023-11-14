import '../../CSS/SavedPage/SavedPage.css'
import React from 'react'
import SavedPage_Leftbar from './SavedPage_Leftbar'
import SavedPage_Main from './SavedPage_Main'

function SavedPage() {
    return (
        <div className='savedPage'>
            <div className="savedPage_leftbar">
                <SavedPage_Leftbar />
            </div>

            <div className='savedPage_Main'>
                <SavedPage_Main />
            </div>
        </div>
    )
}

export default SavedPage