import '../../CSS/HomePage/HomePage.css'
import React, { useState } from 'react'
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'
import HomePage_Messages from './HomePage_Messages'

function HomePage() {
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

    const openNewMessageModal = () => {
        setIsNewMessageModalOpen(true);
    };

    const closeNewMessageModal = () => {
        setIsNewMessageModalOpen(false);
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
                <div id='newMsg'>
                    <i onClick={openNewMessageModal}></i>
                </div>
                <HomePage_Messages
                    isOpen={isNewMessageModalOpen}
                    onRequestClose={closeNewMessageModal}
                />
            </div>
        </div>
    )
}

export default HomePage