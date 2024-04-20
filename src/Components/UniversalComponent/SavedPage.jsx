import '../../CSS/UniversalComponent/SavedPage.css'


import { NavLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TuneIcon from '@mui/icons-material/Tune';

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
        <div className='savedPage'>
            {/* <div className="savedPage_leftbar">
                <SavedPage_Leftbar />
            </div> */}

            <div className='savedPageLeftbar'>
                <div className="savedPageLeftbar_Top">
                    <p>Saved</p>
                    <SettingsIcon />
                </div>

                <div className="savedPageLeftbar_Bottom">
                    <NavLink to="/savedpage/" activeClassName="active">
                        <div className="savedPageLeftbar_BottomOption">
                            <BadgeOutlinedIcon />
                            <p>Saved items</p>
                        </div>
                    </NavLink>
                </div>
            </div>

            {/* <div className='savedPage_Main'>
                <SavedPage_Main />
            </div> */}

            <div className='SavedPageMain'>
                <div className='SavedPageMain_Top'>
                    <p>All</p>
                    <TuneIcon />
                </div>

                <div className='SavedPageMain_Bottom'>
                    {savedPostItems.map(postitem => (
                        <div key={postitem.id} className='savedPosts'>
                            <div className='savedPosts_Left'>
                                {console.log(savedPostItems)}
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