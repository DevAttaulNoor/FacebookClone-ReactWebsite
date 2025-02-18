import '../../CSS/UniversalComponent/SavedPage.css'
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setSelectedPost } from '../../Redux/postSlice';
import { setSelectedReel } from '../../Redux/reelSlice';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

function SavedPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const savedItemsData = useSelector((state) => state.data.savedItems.savedItemsData);
    const [dropdownVisibility, setDropdownVisibility] = useState({});
    const dropdownRef = useRef(null);

    const toggleDropdown = (postId) => {
        setDropdownVisibility(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const handleDelSaveItem = async (itemId) => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedItems").doc(itemId).delete();
            console.log("Document successfully deleted");
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (postId, event) => {
            // Check if dropdownRef exists and if the click occurred outside of it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisibility(prevState => ({
                    ...prevState,
                    [postId]: false // Close the dropdown for this specific post
                }));
            }
        };

        const handleClick = (postId) => (event) => {
            handleClickOutside(postId, event);
        };

        // Add event listeners for each post
        Object.keys(dropdownVisibility).forEach(postId => {
            document.addEventListener('mousedown', handleClick(postId));
        });

        // Remove event listeners when the component unmounts
        return () => {
            Object.keys(dropdownVisibility).forEach(postId => {
                document.removeEventListener('mousedown', handleClick(postId));
            });
        };
    }, [dropdownVisibility]);

    return (
        <div className='savedpage'>
            <div className='savedpageLeftbar'>
                <div className="savedpageLeftbarTop">
                    <p>Saved</p>
                    <SettingsIcon />
                </div>

                <div className="savedpageLeftbarBottom">
                    <NavLink to="/savedpage/" activeclassname="active">
                        <div className="savedpageLeftbarBottomOption">
                            <BadgeOutlinedIcon />
                            <p>Saved items</p>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className='savedpageMain'>
                <div className='savedpageMainTop'>
                    <p>All</p>
                    <TuneIcon />
                </div>

                <div className='savedpageMainBottom'>
                    {savedItemsData.map(saveditem => (
                        <div className='savedPosts' key={saveditem.id}>
                            <div className='savedPosts_Left'>
                                {saveditem.data.reel ? (
                                    <img src={saveditem.data.reel[0].background} alt="reelBackground" />
                                ) : (
                                    <>
                                        {saveditem.data.mediaType === 'image' ? (
                                            <img src={saveditem.data.media} alt="" />
                                        ) : (
                                            <video id="postVideo">
                                                <source src={saveditem.data.media} type="video/mp4" />
                                            </video>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className='savedPosts_Right'>
                                <div className='savedPosts_RightTop'>
                                    <h3>{saveditem.data.message}</h3>
                                    <div className='savedPosts_RightTopBottom'>
                                        <img src={saveditem.data.photoURL} alt="" />
                                        <div>
                                            <p>Saved from</p>
                                            {saveditem.data.reel ? (
                                                <NavLink to={`/reelpage/${saveditem.id}`} onClick={() => dispatch(setSelectedReel(saveditem.id))}>
                                                    <span>{saveditem.data.username}'s reel</span>
                                                </NavLink>
                                            ) : (
                                                <NavLink to={`/profilepage/${saveditem.data.uid}/post/${saveditem.id}`} onClick={() => dispatch(setSelectedPost(saveditem.id))}>
                                                    <span>{saveditem.data.username}'s post</span>
                                                </NavLink>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='savedPosts_RightBottom'>
                                    <button>Add to collection</button>
                                    <MoreHorizIcon onClick={() => toggleDropdown(saveditem.id)} />
                                    {dropdownVisibility[saveditem.id] && (
                                        <div className="dropdown" ref={dropdownRef}>
                                            <div className='dropdownOption' onClick={() => handleDelSaveItem(saveditem.id)}>
                                                <i id='unsavePostIcon'></i>
                                                <h5>Unsave</h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SavedPage