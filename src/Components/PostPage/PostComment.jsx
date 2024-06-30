import '../../CSS/PostPage/PostComment.css';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { timeAgoInitials } from "../../Assets/Utility/TimeModule";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function PostComment({ id, userid, closeModal }) {
    const user = useSelector((state) => state.data.user.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const commentsContainerRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            postComment();
        }
    };

    const deleteComment = async (commentId) => {
        try {
            // Delete a comment from the "Posts" and "Notification" collection
            await db.collection("Posts").doc(id).collection("comments").doc(commentId).delete();
            await db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Comments').doc(commentId).delete();
        } catch (error) {
            console.error("Error removing comment: ", error);
        }
    };

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
            timestamp: Math.floor(new Date().getTime() / 1000),
        };

        setComment('');

        // To scroll to the latest typed comment
        if (commentsContainerRef.current) {
            const lastChild = commentsContainerRef.current.lastChild;
            if (lastChild) {
                lastChild.scrollIntoView({ behavior: "smooth" });
            }
        }

        try {
            // Add a comment to the "Posts" collection
            const commentRef = await db.collection("Posts").doc(id).collection("comments").add(newComment);

            // Add a notification to the "Notifications" subcollection
            if (userid !== user.uid) {
                await db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Comments').doc(commentRef.id).set({
                    postid: id,
                    postuserid: userid,
                    userid: user.uid,
                    username: user.username,
                    userphotoUrl: user.photoURL,
                    commentid: commentRef.id,
                    commenttext: comment,
                    timestamp: Math.floor(new Date().getTime() / 1000),
                    status: 'commented',
                    notificationStatus: 'notseen',
                });
            }

        } catch (error) {
            console.error("Error posting comment:", error);
        }
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
        <div className='postComment'>
            <div className="postCommentTop">
                <p>Comments</p>
                <CloseIcon onClick={closeModal.closeCommentModal} />
            </div>

            <div className="postCommentMiddle" ref={commentsContainerRef}>
                {comments.map((comment) => (
                    <div className='comments' key={comment.id}>
                        <Avatar src={comment.photoURL} />
                        <div className="commentInner">
                            <div className='commentTop'>
                                <h4>{comment.username}</h4>
                                <p>{comment.text}</p>
                            </div>
                            <div className='commentBottom'>
                                {comment.uid === user.uid && <button onClick={() => deleteComment(comment.id)}>Delete</button>}
                                <p>{timeAgoInitials(comment.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="postCommentBottom">
                <div className='commentInput'>
                    <Avatar src={user.photoURL} />
                    <input
                        type='text'
                        value={comment}
                        placeholder='Write a comment...'
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <SendIcon className='sendBtn' onClick={postComment} />
                </div>
            </div>
        </div>
    )
}

export default PostComment;