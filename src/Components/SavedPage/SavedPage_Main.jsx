import '../../CSS/SavedPage/SavedPage_Main.css';
import React, { useEffect, useState } from 'react';
import { useStateValue } from '../BackendRelated/StateProvider';
import { db } from '../BackendRelated/Firebase';

function SavedPage_Main() {
    const [{ user }] = useStateValue();
    const [savedPost, setSavedPost] = useState([]);
    const [savedPostItems, setSavedPostItems] = useState('')

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

    const fetchPostAttributes = async (postId) => {
        try {
            const postDoc = await db.collection('Posts').doc(postId).get();
            if (postDoc.exists) {
                setSavedPostItems(postDoc.data())
            } else {
                console.log('Post not found.');
            }
        } catch (error) {
            console.error('Error fetching post attributes:', error);
        }
    };

    useEffect(() => {
        // Fetch post attributes when savedPost changes
        savedPost.forEach(post => {
            fetchPostAttributes(post.postid);
        });
    }, [savedPost]);

    return (
        <div className='SavedPageMain'>
            <div>
                {/* Render your saved posts */}
                {savedPost.map(post => (
                    <div key={post.id}>
                        <p>{post.postid}</p>
                        <p>{post.timestamp.toDate().toLocaleString()}</p>
                    </div>
                ))}

                <div>
                    {console.log(savedPostItems)}
                    {savedPostItems && (
                        <div>
                            <p>{savedPostItems.message}</p>
                            <p>{savedPostItems.media}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SavedPage_Main;
