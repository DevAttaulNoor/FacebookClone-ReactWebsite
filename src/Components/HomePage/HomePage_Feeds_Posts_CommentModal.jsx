import '../../CSS/HomePage/HomePage_Feeds_Posts_CommentModal.css';
import React, { useState, useEffect } from 'react';
import { db } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function HomePage_Feeds_Posts_CommentModal({ id, userid, closeModal }) {
    const [{ user }] = useStateValue();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const postComment = async () => {
        if (comment.trim() === '') {
            return;
        }
    
        const newComment = {
            uid: user.uid,
            email: user.email,
            username: user.username,
            photoURL: user.photoURL,
            text: comment,
            timestamp: new Date(),
        };
    
        try {
            // Add a comment to the "Posts" collection
            const commentRef = await db.collection("Posts").doc(id).collection("comments").add(newComment);
            setComment('');
    
            // Add a notification to the "Notifications" subcollection
            await db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('Comments').doc(commentRef.id).set({
                postid: id,
                postuserid: userid,
                commentuserid: user.uid,
                commentusername: user.username,
                commenttext: comment,
                timestamp: new Date(),
                status: 'Comment'
            });
    
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };
    
    const deleteComment = async (commentId) => {
        try {
            // Delete a comment from the "Posts" collection
            await db.collection("Posts").doc(id).collection("comments").doc(commentId).delete();
            console.log("Comment successfully deleted!");
    
            // Update the status of the specific comment in the "Notifications" subcollection
            await db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('Comments').doc(commentId).update({
                status: 'Uncomment'
            });
        } catch (error) {
            console.error("Error removing comment: ", error);
        }
    };
    

    const timeAgowithInitials = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0s"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            D: 315360000,
            Y: 31536000,
            M: 2628000,
            w: 604800,
            d: 86400,
            h: 3600,
            m: 60,
            s: 1,
        };

        let elapsed = 0;
        let granularity = 0;
        let unit = '';

        for (const period in periods) {
            elapsed = Math.floor(secondsDifference / periods[period]);

            if (elapsed >= 1) {
                granularity = elapsed;
                unit = period;
                break;
            }
        }
        return `${granularity}${unit}${granularity > 1 ? '' : ''}`;
    };

    useEffect(() => {
        const getRealtimeComments = () => {
            const commentsRef = db.collection("Posts").doc(id).collection("comments");

            // Set up a real-time listener for new comments and changes
            return commentsRef.orderBy("timestamp", "asc").onSnapshot((querySnapshot) => {
                const fetchedComments = [];
                querySnapshot.forEach((doc) => {
                    fetchedComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(fetchedComments);
            });
        };

        const unsubscribe = getRealtimeComments();

        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [id]);

    return (
        <div className='HomePageFeedsPosts_CommentModal'>
            <div className="HomePageFeedsPosts_CommentModal_Top">
                <CloseIcon onClick={closeModal.closeCommentModal} />
                <p>Comments</p>
            </div>

            <hr />

            <div className="HomePageFeedsPosts_CommentModal_Middle">
                {comments.map((comment) => (
                    <div className='comments' key={comment.id}>
                        <Avatar src={comment.photoURL} />
                        <div className="commentInner">
                            <div className='commentTop'>
                                <h4>{comment.username}</h4>
                                <p>{comment.text}</p>
                            </div>
                            <div className='commentBottom'>
                                <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                <p>{timeAgowithInitials(comment.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="HomePageFeedsPosts_CommentModal_Bottom">
                <div className='commentInput'>
                    <Avatar src={user.photoURL} />
                    <input type='text' placeholder='Write a comment...' value={comment} onChange={(e) => setComment(e.target.value)} />
                    <SendIcon onClick={postComment} />
                </div>
            </div>
        </div>
    )
}

export default HomePage_Feeds_Posts_CommentModal