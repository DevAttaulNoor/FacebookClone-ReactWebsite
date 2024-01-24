import "../../CSS/UniversalComponent/PostPage.css"
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { db } from "../BackendRelated/Firebase";
import { useStateValue } from '../BackendRelated/StateProvider';
import { Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

function PostPage({ id, userid }) {
    let location = useLocation();
    let postId = location.state.from;
    const [post, setPost] = useState(null);
    const [commentss, setCommentss] = useState([])

    const [{ user }] = useStateValue();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const postRef = db.collection('Posts').doc(postId);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPost(doc.data());
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [postId]);

    useEffect(() => {
        const unsubscribe = db.collection('Posts').doc(postId).collection('comments').onSnapshot((snapshot) => {
            const commentsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCommentss(commentsData);
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [postId]);

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
            await db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Comments').doc(commentRef.id).set({
                postid: id,
                postuserid: userid,
                commentuserid: user.uid,
                commentusername: user.username,
                commentuserphotoUrl: user.photoURL,
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
            await db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Comments').doc(commentId).update({
                status: 'Uncomment'
            });
        } catch (error) {
            console.error("Error removing comment: ", error);
        }
    };

    const timeAgo = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0 second ago"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            decade: 315360000,
            year: 31536000,
            month: 2628000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
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
        return `${granularity} ${unit}${granularity > 1 ? 's' : ''} ago`;
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

    return (
        <div className="postPage">
            {console.log(post)}
            {console.log(commentss)}

            <div className="postPageInner">
                <div className="postPageInner_Top">
                    <div className="postPageInner_TopLeft">
                        <Avatar src={post.photoURL} />
                        <div className="postPageInner_TopLeftMain">
                            <h4>{post.username}</h4>
                            <p>{timeAgo(post.timestamp)} <PublicIcon /> </p>
                        </div>
                    </div>

                    <div className="postPageInner_TopRight">
                        <MoreHorizIcon />
                    </div>
                </div>

                <div className="postPageInner_Middle">
                    <div className="postPageInner_MiddleTop">
                        <p>{post.message}</p>
                    </div>

                    <div className="postPageInner_MiddleMiddle">
                        {post.media == '' ? (
                            <p></p>
                        ) : (
                            post.mediaType == 'image' ? (
                                <img src={post.media} />
                            ) : post.mediaType == 'video' ? (
                                <video controls>
                                    <source src={post.media} type="video/mp4" />
                                </video>
                            ) : (
                                <p></p>
                            )
                        )}
                    </div>

                    <div className="postPageInner_MiddleBottom">
                        <div className="postPageInner_MiddleBottom_Top">
                            {post.likesCount >= 1 ? (
                                <p>{post.likesCount} like</p>
                            ) : (
                                <p>{post.likesCount} likes</p>
                            )}

                            {commentss.length >= 1 ? (
                                <p>{commentss.length} comment</p>
                            ) : (
                                <p>{commentss.length} comments</p>
                            )}
                        </div>

                        <div className="postPageInner_MiddleBottom_Bottom">
                            <div className='postPageInner_MiddleBottom_BottomOption'>
                                <ThumbUpAltOutlinedIcon />
                                <p>Like</p>
                            </div>

                            <div className='postPageInner_MiddleBottom_BottomOption'>
                                <ChatBubbleOutlineOutlinedIcon />
                                <p>Comment</p>
                            </div>

                            <div className='postPageInner_MiddleBottom_BottomOption'>
                                <ReplyOutlinedIcon />
                                <p>Share</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="postPageInner_Bottom">
                    <div className="postPageInner_BottomTop">
                        {commentss.map((comment) => (
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

                    <div className='postPageInner_BottomBottom'>
                        <div className='commentInput'>
                            <Avatar src={user.photoURL} />
                            <input type='text' placeholder='Write a comment...' value={comment} onChange={(e) => setComment(e.target.value)} />
                            <SendIcon onClick={postComment} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostPage