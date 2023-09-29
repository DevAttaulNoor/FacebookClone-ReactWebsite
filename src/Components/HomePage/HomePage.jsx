import '../../CSS/HomePage/HomePage.css'
import React from 'react'
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'

function HomePage() {
    return (
        <div className='homepage'>
            <div className='homepage_SidebarsLeft'>
                <HomePage_Leftbar />
            </div>
            <div className='homepage_MainFeed'>
                <HomePage_Feeds />
            </div>
            <div className='homepage_SidebarsRight'>
                <HomePage_Rightbar />
            </div>
        </div>
    )
}

export default HomePage