import '../../CSS/UniversalComponent/SavedPage.css'
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

function SavedPage() {
    const user = useSelector((state) => state.data.user.user);
    const [savedPost, setSavedPost] = useState([]);
    const [savedPostItems, setSavedPostItems] = useState([]);

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
            const postItems = await Promise.all(savedPost.map(post => fetchPostAttributes(post.postid)));
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
                    <NavLink to="/savedpage/" activeClassName="active">
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
                        <div key={postitem.id} className='savedPosts'>
                            <div className='savedPosts_Left'>
                                {postitem.mediaType == 'image' ? (
                                    <img src={postitem.media} alt="" />
                                ) : (
                                    <video id="postVideo">
                                        <source src={postitem.media} type="video/mp4" />
                                    </video>
                                )}
                            </div>

                            <div className='savedPosts_Right'>
                                <div className='savedPosts_RightTop'>
                                    <h3>{postitem.message}</h3>
                                    <div className='savedPosts_RightTopBottom'>
                                        <img src={postitem.photoURL} alt="" />
                                        <p>Saved from <span>{postitem.username}'s post</span></p>
                                    </div>
                                </div>

                                <div className='savedPosts_RightBottom'>
                                    <button>Add to collection</button>
                                    <MoreHorizIcon />
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