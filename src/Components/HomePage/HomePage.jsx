import '../../CSS/HomePage/HomePage.css'
import React, { useState, useRef, useEffect } from 'react';
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'
import HomePage_Messages from './HomePage_Messages';

function HomePage() {
    const [isMessageBox, setIsMessageBox] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);

    const messageBoxClose = () => {
        setIsMessageBox(false);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(e.target)) {
                setIsDialogVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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
                    <i onClick={() => setIsMessageBox(true)}></i>
                </div>

                {isMessageBox && (
                    <HomePage_Messages close={messageBoxClose} />
                )}
            </div>
        </div>
    )
}

export default HomePage;