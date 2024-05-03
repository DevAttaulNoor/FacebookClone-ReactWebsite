import '../../CSS/HomePage/HomepageFeedPostsCmtModal.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function HomepageFeedPostsCmtModal({ id, userid, closeModal }) {
    const user = useSelector((state) => state.data.user.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const commentsContainerRef = useRef(null);

    console.log(comments.uid)

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
                    timestamp: new Date(),
                    status: 'commented',
                    notificationStatus: 'notseen',
                });
            }

        } catch (error) {
            console.error("Error posting comment:", error);
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
        <div className='homepageFeedPosts_CommentModal'>
            <div className="homepageFeedPosts_CommentModalTop">
                <p>Comments</p>
                <CloseIcon onClick={closeModal.closeCommentModal} />
            </div>

            <div className="homepageFeedPosts_CommentModalMiddle" ref={commentsContainerRef}>
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
                                <p>{timeAgowithInitials(comment.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="homepageFeedPosts_CommentModalBottom">
                <div className='commentInput'>
                    <Avatar src={user.photoURL} />
                    <input type='text' placeholder='Write a comment...' value={comment} onChange={(e) => setComment(e.target.value)} />
                    <SendIcon onClick={postComment} />
                </div>
            </div>
        </div>
    )
}

export default HomepageFeedPostsCmtModal;