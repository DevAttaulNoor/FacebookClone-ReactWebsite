import '../../CSS/HomePage/HomepageFeedReels.css'
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { db } from '../../Firebase/firebase';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function HomepageFeedReels() {
    const user = useSelector((state) => state.data.user.user);
    const [reels, setReels] = useState([]);
    const initialShowLeftButton = sessionStorage.getItem('showLeftButton') === 'true' || false;
    const initialShowRightButton = sessionStorage.getItem('showRightButton') === 'true' || false;
    const [showLeftButton, setShowLeftButton] = useState(initialShowLeftButton);
    const [showRightButton, setShowRightButton] = useState(initialShowRightButton);
    const containerRef = useRef(null);

    const scrollLeft = () => {
        if (containerRef.current) {
            const scrollAmount = -150;
            const scrollDuration = 300;
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
            containerRef.current.scrollLeft += 150;
        }
    };

    useEffect(() => {
        db.collection("Reels").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const reelsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReels(reelsData);
        });
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        // Function to check scroll position and update button visibility
        const checkButtons = () => {
            if (container) {
                const scrollPosition = container.scrollLeft;
                const maxScroll = container.scrollWidth - container.clientWidth;
                const newShowLeftButton = scrollPosition > 0;
                const newShowRightButton = scrollPosition < maxScroll;

                // Update state based on scroll position
                setShowLeftButton(newShowLeftButton);
                setShowRightButton(newShowRightButton);

                // Store button states in session storage
                sessionStorage.setItem('showLeftButton', newShowLeftButton.toString());
                sessionStorage.setItem('showRightButton', newShowRightButton.toString());
            }
        };

        // Initial check when component mounts
        checkButtons();

        if (container) {
            container.addEventListener('scroll', checkButtons);
        }

        // Cleanup when component unmounts
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkButtons);
            }
        };
    }, [showLeftButton, showRightButton]);

    return (
        <>
            {reels.length === 0 ? (
                <div className="homepageFeedReels">
                    <NavLink to={'/homepage/storyreels'}>
                        <AddIcon />
                        <div className='homepageFeedReelsInfo'>
                            <h2>Create Story</h2>
                            <p>Share a photo or write something.</p>
                        </div>
                    </NavLink >
                </div>
            ) : (
                <div className="homepageFeedReels_Scroll">
                    {showLeftButton && (<button id='leftScroll' onClick={scrollLeft}><KeyboardArrowLeftIcon /></button>)}

                    <div className='homepageFeedReels_ScrollReels' ref={containerRef}>
                        <NavLink to={'/homepage/storyreels'}>
                            <div className="homepageFeedReels_ScrollReelsInner">
                                <img src={user.photoURL} alt="" />
                                <div className='ScrollReelsCreate'>
                                    <AddIcon />
                                    <h5>Create story</h5>
                                </div>
                            </div>
                        </NavLink >

                        {reels.map((reel) => (
                            <div
                                key={reel.id}
                                className="homepageFeedReels_ScrollReelsStories"
                                style={{
                                    background: reel.background.startsWith("https") ? `url(${reel.background})` : reel.background,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >

                                <Avatar src={reel.photoURL} />
                                <div className="ReelsStoriesTextOverlay">
                                    {reel.text}
                                </div>
                                <p>{reel.username}</p>
                            </div>
                        ))}
                    </div>

                    {showRightButton && (<button id='rightScroll' onClick={scrollRight}><KeyboardArrowRightIcon /></button>)}
                </div>
            )}
        </>
    )
}

export default HomepageFeedReels;