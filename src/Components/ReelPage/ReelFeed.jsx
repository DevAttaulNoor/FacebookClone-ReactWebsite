import '../../CSS/ReelPage/ReelFeed.css';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setReels, setSelectedReel } from '../../Redux/reelSlice';
import { db } from '../../Firebase/firebase';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function ReelFeed() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const reels = useSelector((state) => state.data.reel.reels);
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
            dispatch(setReels(reelsData));
        });
    }, [dispatch]);

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
                <div className="reelFeed">
                    <NavLink to={'/homepage/storyreels'}>
                        <AddIcon />
                        <div className='reelFeedInfo'>
                            <h2>Create Story</h2>
                            <p>Share a photo or write something.</p>
                        </div>
                    </NavLink >
                </div>
            ) : (
                <div className="reelFeed_Scroll">
                    {showLeftButton && (<button id='leftScroll' onClick={scrollLeft}><KeyboardArrowLeftIcon /></button>)}

                    <div className='reelFeed_ScrollReels' ref={containerRef}>
                        <NavLink to={'/homepage/storyreels'}>
                            <div className="reelFeed_ScrollReelsInner">
                                <img src={user.photoURL} alt="" />
                                <div className='ScrollReelsCreate'>
                                    <AddIcon />
                                    <h5>Create story</h5>
                                </div>
                            </div>
                        </NavLink >

                        {reels.map((reelContent) => (
                            <NavLink to={'/reelpage/'} onClick={() => dispatch(setSelectedReel(reelContent.id))}>
                                <div
                                    key={reelContent.id}
                                    className="reelFeed_ScrollReelsStories"
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

export default ReelFeed;