import '../../CSS/HomePage/HomePage_Feeds_StoryReels.css'
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useStateValue } from '../BackendRelated/StateProvider';
import { db } from '../BackendRelated/Firebase';
import AddIcon from '@mui/icons-material/Add';
import HomePage_StoryReels from './HomePage_StoryReels';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function HomePage_Feeds_StoryReels() {
    const containerRef = useRef(null);
    const [{ user }, dispatch] = useStateValue();
    const [reels, setReels] = useState([]);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    useEffect(() => {
        db.collection("Reels")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                const reelsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReels(reelsData);
            });
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const checkButtons = () => {
            if (container) {
                setShowLeftButton(container.scrollLeft > 0);
                setShowRightButton(
                    container.scrollLeft < container.scrollWidth - container.clientWidth ||
                    container.scrollWidth === container.clientWidth
                );
            }
        };

        if (container) {
            container.addEventListener('scroll', checkButtons);
        }

        checkButtons();

        // Cleanup when component unmounts
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkButtons);
            }
        };
    }, []);

    const scrollLeft = () => {
        if (containerRef.current) {
            const scrollAmount = -240;
            const scrollDuration = 300; // Duration of the smooth scroll animation (in milliseconds)
            const container = containerRef.current;

            const startTime = performance.now();
            const scroll = (currentTime) => {
                const elapsedTime = currentTime - startTime;

                if (elapsedTime < scrollDuration) {
                    const easing = (t) => t * (2 - t);
                    const progress = elapsedTime / scrollDuration;
                    const scrollPosition = scrollAmount * easing(progress);
                    container.scrollBy({ left: scrollPosition, behavior: 'smooth' });
                    requestAnimationFrame(scroll);
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            };

            requestAnimationFrame(scroll);
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 240;
        }
    };

    return (
        <>
            {reels.length === 0 ? (
                <div className='homepage_feeds_StoryReels'>
                    <Routes>
                        <Route path='storyreels' element={<HomePage_StoryReels />} />
                    </Routes>

                    <NavLink to={'/homepage/storyreels'}>
                        <div className="homepage_feeds_StoryReels_Inner">
                            <AddIcon />
                            <div className='homepage_feeds_StoryReels_InnerInfo'>
                                <h2>Create Story</h2>
                                <p>Share a photo or write something.</p>
                            </div>
                        </div>
                    </NavLink >
                </div >
            ) : (
                <div className="scroll-container">
                    {showLeftButton && (<button id='leftScroll' onClick={scrollLeft}><KeyboardArrowLeftIcon /></button>)}
                    <div className='homepage_feeds_StoryReels_withReels' ref={containerRef}>
                        <NavLink to={'/homepage/storyreels'}>
                            <div className="homepage_feeds_StoryReels_withReelsInner">
                                <img src={user.photoURL} alt="" />
                                <div className='createStory'>
                                    <AddIcon />
                                    <h3>Create story</h3>
                                </div>
                            </div>
                        </NavLink >

                        {reels.map((reel) => (
                            <div
                                key={reel.id}
                                className="homepage_feeds_StoryReels_withReelsStories"
                                style={{
                                    background: reel.background.startsWith("http") ? `url(${reel.background})` : reel.background,
                                }}
                            >
                                <div className="reel-text-overlay">
                                    {reel.text}
                                </div>
                                <Avatar src={reel.photoURL} />
                                <p>{reel.username}</p>
                            </div>
                        ))}

                    </div>
                    {showRightButton && ( <button id='rightScroll' onClick={scrollRight}><KeyboardArrowRightIcon /></button>)}
                </div>
            )}
        </>
    )
}

export default HomePage_Feeds_StoryReels;