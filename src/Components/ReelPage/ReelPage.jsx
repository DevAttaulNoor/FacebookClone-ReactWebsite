import '../../CSS/ReelPage/ReelPage.css';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import { setReels, setSelectedReel } from '../../Redux/reelSlice';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function ReelPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const reels = useSelector((state) => state.data.reel.reels);
    const allReels = reels.filter(reel => reel.uid !== user.uid);
    const userReel = reels.filter(reel => reel.uid === user.uid);
    const selectedReel = useSelector((state) => state.data.reel.selectedReel);
    const selectedReelContent = reels.filter(reel => reel.id === selectedReel);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const maxReelLength = selectedReelContent[0]?.reel.length || 0;
    const currentReelContent = selectedReelContent[0]?.reel[currentReelIndex];
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

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

            // Get the updated reel data
            const reelDocRef = db.collection('Reels').doc(selectedReelContent[0].id);
            const reelData = selectedReelContent[0].reel.filter((_, index) => index !== currentReelIndex);

            if (reelData.length === 0) {
                await reelDocRef.delete();
            } else {
                await reelDocRef.update({ reel: reelData });
            }

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

    const timeAgowithInitials = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0s"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            D: 315360000,
            Y: 31536000,
            M: 2628000,
            w: 604800,
            d: 86400,
            h: 3600,
            m: 60,
            s: 1,
        };

        let elapsed = 0;
        let granularity = 0;
        let unit = '';

        for (const period in periods) {
            elapsed = Math.floor(secondsDifference / periods[period]);

            if (elapsed >= 1) {
                granularity = elapsed;
                unit = period;
                break;
            }
        }
        return `${granularity}${unit}${granularity > 1 ? '' : ''}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

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
            dispatch(setReels(reelsData));
        });
    }, [dispatch]);

    return (
        <div className="reelpage">
            <div className='reelpageLeftbar'>
                <div className="reelpageLeftbarTop">
                    <h1>Stories</h1>
                    <SettingsIcon />
                </div>

                <div className="reelpageLeftbarMiddle">
                    <h5 id='title'>Your story</h5>

                    {userReel.length !== 0 ? (
                        <>
                            {userReel.map(reelContent => (
                                <div key={reelContent.id}
                                    className={`userInfoContainer ${(selectedReel === reelContent.id) ? 'active' : ''}`}
                                    onClick={() => dispatch(setSelectedReel(reelContent.id))}
                                >
                                    <div className='userInfo'>
                                        <img src={reelContent.photoURL} alt="" />
                                        <div className='userInfoRight'>
                                            <h5>{reelContent.username}</h5>
                                            <p>{timeAgowithInitials(reelContent.timestamp)}</p>
                                        </div>
                                    </div>

                                    <NavLink to={'/homepage/storyreels'}>
                                        <AddIcon />
                                    </NavLink>
                                </div>
                            ))}
                        </>
                    ) : (
                        <NavLink to={'/homepage/storyreels'}>
                            <div className='createReelContainer'>
                                <div className='createReelInner'>
                                    <AddIcon />
                                    <div className='createReelRight'>
                                        <h5>Create a story</h5>
                                        <p>Share a photo or write something.</p>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    )}
                </div>

                <div className="reelpageLeftbarBottom">
                    {allReels.length === 0 ? (
                        <p id='noStories'>There are no stories to be shown from friends and others</p>
                    ) : (
                        <>
                            <h5 id='title'>All stories</h5>

                            {allReels.map(reelContent => (
                                <div key={reelContent.id}
                                    className={`userInfoContainer ${(selectedReel === reelContent.id) ? 'active' : ''}`}
                                    onClick={() => dispatch(setSelectedReel(reelContent.id))}
                                >
                                    <div className='userInfo'>
                                        <img src={reelContent.photoURL} alt="" />
                                        <div className='userInfoRight'>
                                            <h5>{reelContent.username}</h5>
                                            <p>{timeAgowithInitials(reelContent.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
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
                                <Avatar src={selectedReelContent[0].photoURL} />

                                <div className='reelTopLeftInfo'>
                                    <h5>{selectedReelContent[0].username}</h5>
                                    <p>{timeAgowithInitials(currentReelContent.timestamp)}</p>
                                </div>
                            </div>

                            <div className="reelTopRight">
                                <div className='reelTopRightOption' onClick={handlePrevious}>
                                    <ArrowLeftIcon />
                                </div>
                                <div className='reelTopRightOption' onClick={handleNext}>
                                    <ArrowRightIcon />
                                </div>
                                <div className='reelTopRightOption'>
                                    <MoreHorizIcon onClick={handleMenuToggle} />
                                    {menuVisible && (
                                        <div className="menu" ref={menuRef}>
                                            <div className='menuOption' onClick={handleDelete}>
                                                <div className="menuOptionLeft">
                                                    <i id='deletePostIcon'></i>
                                                </div>
                                                <div className="menuOptionRight">
                                                    <h5>Delete</h5>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default ReelPage;