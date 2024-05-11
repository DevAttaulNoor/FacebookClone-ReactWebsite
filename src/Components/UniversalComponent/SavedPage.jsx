import '../../CSS/UniversalComponent/SavedPage.css'
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setSelectedPost } from '../../Redux/postSlice';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

function SavedPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [savedPost, setSavedPost] = useState([]);
    const [savedPostItems, setSavedPostItems] = useState([]);
    const [dropdownVisibility, setDropdownVisibility] = useState({});
    const dropdownRef = useRef(null);

    const toggleDropdown = (postId) => {
        setDropdownVisibility(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const handleDelSavePost = async (postId) => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedPosts").doc(postId).delete();
            console.log("Document successfully deleted");
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const fetchPostAttributes = async (postId) => {
        try {
            const postDoc = await db.collection('Posts').doc(postId).get();
            if (postDoc.exists) {
                return postDoc.data(); // Return the data
            } else {
                console.log('Post not found.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching post attributes:', error);
            return null;
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

    useEffect(() => {
        const savedRef = db.collection('Users').doc(user.uid).collection('SavedPosts');

        const unsubscribe = savedRef.onSnapshot((snapshot) => {
            const savedPostsData = snapshot.docs.map(doc => doc.data());
            setSavedPost(savedPostsData);
        });

        return () => {
            unsubscribe();
        };
    }, [user.uid]);

    useEffect(() => {
        const fetchData = async () => {
            const postItems = await Promise.all(savedPost.map(async (savedPostItem) => {
                const postId = savedPostItem.postid;
                const postData = await fetchPostAttributes(postId);
                if (postData) {
                    return { id: postId, data: postData };
                }
                return null;
            }));
            setSavedPostItems(postItems.filter(item => item !== null));
        };

        fetchData();
    }, [savedPost]);

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
                    {savedPostItems.map(postitem => (
                        <div className='savedPosts' key={postitem.id}>
                            <div className='savedPosts_Left'>
                                {postitem.data.mediaType === 'image' ? (
                                    <img src={postitem.data.media} alt="" />
                                ) : (
                                    <video id="postVideo">
                                        <source src={postitem.data.media} type="video/mp4" />
                                    </video>
                                )}
                            </div>

                            <div className='savedPosts_Right'>
                                <div className='savedPosts_RightTop'>
                                    <h3>{postitem.data.message}</h3>
                                    <div className='savedPosts_RightTopBottom'>
                                        <img src={postitem.data.photoURL} alt="" />
                                        <div>
                                            <p>Saved from</p>
                                            <NavLink to={`/profilepage/${postitem.data.uid}/post/${postitem.id}`} onClick={() => dispatch(setSelectedPost(postitem.id))}>
                                                <span>{postitem.data.username}'s post</span>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className='savedPosts_RightBottom'>
                                    <button>Add to collection</button>
                                    <MoreHorizIcon onClick={() => toggleDropdown(postitem.id)} />
                                    {dropdownVisibility[postitem.id] && (
                                        <div className="dropdown" ref={dropdownRef}>
                                            <div className='dropdownOption' onClick={() => handleDelSavePost(postitem.id)}>
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