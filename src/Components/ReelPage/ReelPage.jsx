import '../../CSS/ReelPage/ReelPage.css';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import { timeAgoInitials } from '../../Assets/Utility/TimeModule';
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
    const [savedReel, setSavedReel] = useState(false);
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

    const handleSaveReel = async () => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedItems").doc(selectedReel).set({
                reelId: selectedReel,
                timestamp: new Date(),
            });
            console.log("Document successfully saved");
            setSavedReel(true);
        } catch (error) {
            console.error("Error saving document: ", error);
        }
    };

    const handleDelSaveReel = async () => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedItems").doc(selectedReel).delete();
            console.log("Document successfully deleted");
            setSavedReel(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
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
        if (user && selectedReel) {
            const checkIfReelExists = async () => {
                const savedReelRef = db.collection("Users").doc(user.uid).collection("SavedItems");
                const snapshot = await savedReelRef.where('reelId', '==', selectedReel).get();

                if (!snapshot.empty) {
                    setSavedReel(true);
                } else {
                    setSavedReel(false);
                }
            };
            checkIfReelExists();
        }
    }, [selectedReel, savedReel, user]);

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
                                <NavLink to={`/reelpage/${reelContent.id}`} key={reelContent.id} onClick={() => dispatch(setSelectedReel(reelContent.id))}>
                                    <div className={`userInfoContainer ${(selectedReel === reelContent.id) ? 'active' : ''}`}>
                                        <div className='userInfo'>
                                            <img src={reelContent.photoURL} alt="" />
                                            <div className='userInfoRight'>
                                                <h5>{reelContent.username}</h5>
                                                <p>{timeAgoInitials(reelContent.timestamp)}</p>
                                            </div>
                                        </div>

                                        <NavLink to={'/homepage/storyreels'} className='createReel'>
                                            <AddIcon />
                                        </NavLink>
                                    </div>
                                </NavLink>
                            ))}
                        </>
                    ) : (
                        <NavLink to={'/homepage/storyreels'} className='createReel'>
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
                                <NavLink to={`/reelpage/${reelContent.id}`} key={reelContent.id} onClick={() => dispatch(setSelectedReel(reelContent.id))}>
                                    <div className={`userInfoContainer ${(selectedReel === reelContent.id) ? 'active' : ''}`}>
                                        <div className='userInfo'>
                                            <img src={reelContent.photoURL} alt="" />
                                            <div className='userInfoRight'>
                                                <h5>{reelContent.username}</h5>
                                                <p>{timeAgoInitials(reelContent.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
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
                                    <p>{timeAgoInitials(currentReelContent.timestamp)}</p>
                                </div>
                            </div>

                            <div className="reelTopRight">
                                <div className='reelTopRightOption' onClick={handlePrevious}>
                                    <ArrowLeftIcon />
                                </div>
                                <div className='reelTopRightOption' onClick={handleNext}>
                                    <ArrowRightIcon />
                                </div>
                                <div className='reelTopRightOption' onClick={handleMenuToggle} ref={menuRef}>
                                    <MoreHorizIcon />
                                    {selectedReelContent[0].uid === user.uid ? (
                                        <>
                                            {menuVisible && (
                                                <div className="menu" >
                                                    <div className='menuOption' onClick={handleDelete}>
                                                        <div className="menuOptionLeft">
                                                            <i id='deleteIcon'></i>
                                                        </div>
                                                        <div className="menuOptionRight">
                                                            <h5>Delete</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {menuVisible && (
                                                <div className="menu">
                                                    {savedReel === false ? (
                                                        <div className='menuOption' onClick={handleSaveReel}>
                                                            <div className="menuOptionLeft">
                                                                <i id='saveIcon'></i>
                                                            </div>
                                                            <div className="menuOptionRight">
                                                                <h5>Save Reel</h5>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='menuOption' onClick={handleDelSaveReel}>
                                                            <div className="menuOptionLeft">
                                                                <i id='unsaveIcon'></i>
                                                            </div>
                                                            <div className="menuOptionRight">
                                                                <h5>Unsave Reel</h5>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
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