import '../../CSS/SavedPage/SavedPage_Main.css';
import React, { useEffect, useState } from 'react';
import { db } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function SavedPage_Main() {
    const [{ user }] = useStateValue();
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
        <div className='SavedPageMain'>
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
                            <p>Saved from <span>{postitem.username}'s post</span></p>
                        </div>

                        <div className='savedPosts_RightBottom'>
                            <button>Add to collection</button>
                            <button><MoreHorizIcon /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SavedPage_Main;