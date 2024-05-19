import '../../CSS/HomePage/HomepageFeedReels.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { db } from '../../Firebase/firebase';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function HomepageFeedReels() {
    const user = useSelector((state) => state.data.user.user);
    const [reels, setReels] = useState([]);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const containerRef = useRef(null);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 150;
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
        const container = containerRef.current; // Store the reference in a variable

        const checkButtons = () => {
            if (container) {
                setShowLeftButton(container.scrollLeft > 0);
                setShowRightButton(container.scrollWidth > container.clientWidth && container.scrollLeft < container.scrollWidth - container.clientWidth);
            }
        };

        checkButtons();

        const resizeListener = () => {
            checkButtons();
        };

        const scrollListener = () => {
            checkButtons();
        };

        window.addEventListener('resize', resizeListener);

        if (container) {
            container.addEventListener('scroll', scrollListener);
        }

        return () => {
            window.removeEventListener('resize', resizeListener);
            if (container) {
                container.removeEventListener('scroll', scrollListener);
            }
        };
    }, [reels]);

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

                        {reels.map((reelContent) => (
                            <NavLink to={'/reelpage/'}>
                                <div
                                    key={reelContent.id}
                                    className="homepageFeedReels_ScrollReelsStories"
                                    style={{
                                        backgroundImage: `url(${reelContent.reel[[reelContent.reel.length - 1]].background})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <Avatar src={reelContent.photoURL} />
                                    <p>{reelContent.username}</p>
                                </div>
                            </NavLink>
                        ))}
                    </div>

                    {showRightButton && (<button id='rightScroll' onClick={scrollRight}><KeyboardArrowRightIcon /></button>)}
                </div>
            )}
        </>
    );
}

export default HomepageFeedReels;