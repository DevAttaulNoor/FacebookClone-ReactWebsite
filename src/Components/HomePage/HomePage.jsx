import '../../CSS/HomePage/HomePage.css'
import React, { useState, useRef, useEffect } from 'react';
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'
import HomePage_Messages from './HomePage_Messages';

function HomePage() {
    const [messageBox, setMessageBox] = useState(false);

    const closeMessageBox = () => {
        setMessageBox(false);
    };

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
            </div>

            <div className="msgRelated">
                <div id='newMsg'>
                    <i onClick={() => setMessageBox(true)}></i>
                </div>

                {messageBox && (
                    <HomePage_Messages handleMessageBox={messageBox} closeBox={closeMessageBox} />
                )}
            </div>
        </div>
    )
}

export default HomePage;