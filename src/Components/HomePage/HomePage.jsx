import '../../CSS/HomePage/HomePage.css'
import React from 'react'
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'

function HomePage() {
    return (
        <div className='homepage'>
            <div className='homepage_Leftbar'>
                <HomePage_Leftbar />
            </div>
            <div className='homepage_MainFeed'>
                <HomePage_Feeds />
            </div>
            <div className='homepage_Rightbar'>
                <HomePage_Rightbar />
                <div id='newMsg'>
                    <i></i>
                </div>
            </div>
        </div>
    )
}

export default HomePage