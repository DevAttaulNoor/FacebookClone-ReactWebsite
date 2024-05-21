import '../../CSS/HomePage/ReelPage.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import { Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { NavLink } from 'react-router-dom';

function ReelPage() {
    const user = useSelector((state) => state.data.user.user);
    const [reels, setReels] = useState([]);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const maxReelLength = reels[0]?.reel.length || 0; // Get the length of the first reel array
    const currentReelContent = reels[0]?.reel[currentReelIndex];

    const [menuVisible, setMenuVisible] = useState(false); // State to handle menu visibility


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReelIndex(prevIndex => {
                if (prevIndex + 1 >= maxReelLength) {
                    clearInterval(interval);
                    return prevIndex;
                }
                return prevIndex + 1;
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [maxReelLength]);

    useEffect(() => {
        db.collection("Reels").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const reelsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReels(reelsData);
        });
    }, []);

    const handleNext = () => {
        setCurrentReelIndex((prevIndex) => (prevIndex + 1) % maxReelLength);
    };

    const handlePrevious = () => {
        setCurrentReelIndex((prevIndex) => (prevIndex - 1 + maxReelLength) % maxReelLength);
    };

    const handleMenuToggle = () => {
        setMenuVisible(!menuVisible);
    };

    const handleDelete = async () => {
        if (!currentReelContent) return;

        try {
            // Delete the image from Firebase Storage
            const imageRef = storage.refFromURL(currentReelContent.background);
            await imageRef.delete();

            // Delete the reel document from Firestore
            const reelDocRef = db.collection('Reels').doc(reels[0].id);
            await reelDocRef.update({
                reel: reels[0].reel.filter((_, index) => index !== currentReelIndex)
            });

            // Hide the menu after deletion
            setMenuVisible(false);

            // Reset the current reel index if needed
            if (currentReelIndex >= maxReelLength - 1) {
                setCurrentReelIndex(0);
            }
        } catch (error) {
            console.error('Error deleting reel: ', error);
        }
    };

    return (
        <div className="reelpage">
            <div className='reelpageLeftbar'>
                <div className="reelpageLeftbarTop">
                    <h1>Stories</h1>
                    <SettingsIcon />
                </div>

                <div className="reelpageLeftbarMiddle">
                    <h5 id='title'>Your story</h5>

                    <div className='userInfoContainer'>
                        <div className='userInfo'>
                            <img src={user.photoURL} alt="" />
                            <div className='userInfoRight'>
                                <h5>{user.username}</h5>
                                <p>timestamp</p>
                            </div>
                        </div>

                        <NavLink to={'/homepage/storyreels'}>
                            <AddIcon />
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className='reelpageMain'>
                {currentReelContent && (
                    <div
                        key={currentReelIndex}
                        className="reel"
                        style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `url(${currentReelContent.background})`,
                        }}
                    >
                        <div className='reelTop'>
                            <div className="reelTopLeft">
                                <Avatar src={reels[0].photoURL} />
                                <p>{reels[0].username}</p>
                            </div>

                            <div className="reelTopRight">
                                <div onClick={handlePrevious}>
                                    <ArrowLeftIcon />
                                </div>
                                <div onClick={handleNext}>
                                    <ArrowRightIcon />
                                </div>
                                <div>
                                    <MoreHorizIcon onClick={handleMenuToggle} />
                                    {menuVisible && (
                                        <div className="menu">
                                            <button onClick={handleDelete}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReelPage;