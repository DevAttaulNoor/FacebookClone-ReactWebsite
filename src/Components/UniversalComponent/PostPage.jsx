import "../../CSS/UniversalComponent/PostPage.css";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { NavLink } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import SendIcon from '@mui/icons-material/Send';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

function PostPage() {
    const user = useSelector((state) => state.data.user.user);
    const selectedPost = useSelector((state) => state.data.post.selectedPost);
    const [post, setPost] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false)
    const visibleComments = showAllComments ? comments : comments.slice(0, 5);
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);

    console.log(selectedPost)

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
            const commentRef = await db.collection("Posts").doc(selectedPost).collection("comments").add(newComment);
            setComment('');

            // Add a notification to the "Notifications" subcollection
            if (post.uid !== user.uid) {
                await db.collection("Users").doc(post.uid).collection("Notifications").doc(post.uid).collection('Comments').doc(commentRef.id).set({
                    postuserid: post.uid,
                    commentuserid: user.uid,
                    commentusername: user.username,
                    commentuserphotoUrl: user.photoURL,
                    commenttext: comment,
                    timestamp: new Date(),
                    status: 'commented'
                });
            }

        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            // Delete a comment from the "Posts" and "Notifications" collection
            await db.collection("Posts").doc(selectedPost).collection("comments").doc(commentId).delete();
            await db.collection("Users").doc(user.uid).collection("Notifications").doc(user.uid).collection('Comments').doc(commentId).delete();
        }

        catch (error) {
            console.error("Error removing comment: ", error);
        }
    };

    const handleShowComments = () => {
        setShowAllComments(true);
    };

    const handleLike = async () => {
        // Check if the user has already liked the post
        const likedUsersRef = db.collection("Posts").doc(selectedPost).collection("likes");
        const likedUserDoc = await likedUsersRef.doc(user.uid).get();

        if (likedUserDoc.exists) {
            // User has previously liked the post, so we should unlike it
            // Update the likes count in Firestore and remove the user's like information
            db.collection("Posts")
                .doc(selectedPost)
                .update({ likesCount: Math.max(likesCount - 1, 0) })
                .catch((error) => {
                    console.error("Error unliking post: ", error);
                });

            db.collection("Users").doc(post.uid).collection("Notifications").doc(post.uid).collection('Likes').doc(selectedPost).delete();

            likedUserDoc.ref
                .delete()
                .catch((error) => {
                    console.error("Error removing like information: ", error);
                });
        } else {
            // User has not liked the post before, so we should like it
            // Update the likes count in Firestore and add the user's like information
            db.collection("Posts")
                .doc(selectedPost)
                .update({ likesCount: likesCount + 1 })
                .catch((error) => {
                    console.error("Error liking post: ", error);
                });

            if (post.uid !== user.uid) {
                db.collection("Users").doc(post.uid).collection("Notifications").doc(post.uid).collection('Likes').doc(selectedPost).set({
                    postuserid: post.uid,
                    userid: user.uid,
                    username: user.username,
                    userphotoUrl: user.photoURL,
                    timestamp: new Date(),
                    status: 'reacted',
                })
            }

            likedUsersRef
                .doc(user.uid)
                .set({
                    uid: user.uid,
                    photoUrl: user.photoURL,
                    username: user.username,
                    email: user.email,
                })
                .catch((error) => {
                    console.error("Error adding like information: ", error);
                });
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

    useEffect(() => {
        const unsubscribe = db.collection('Posts').doc(selectedPost).onSnapshot((doc) => {
            if (doc.exists) {
                setPost(doc.data());
            }
        });
        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [selectedPost]);

    useEffect(() => {
        const getRealtimeComments = () => {
            const commentsRef = db.collection("Posts").doc(selectedPost).collection("comments").orderBy("timestamp", "asc").onSnapshot((querySnapshot) => {
                const fetchedComments = [];
                querySnapshot.forEach((doc) => {
                    fetchedComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(fetchedComments);
            });
            // Return the unsubscribe function to clean up the listener
            return () => {
                commentsRef(); // Unsubscribe the listener
            };
        };

        // Call the function to set up the listener
        getRealtimeComments();
    }, [selectedPost]);

    //* useEffect to get all the like count on a post from the firestore
    useEffect(() => {
        const postRef = db.collection("Posts").doc(selectedPost);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setLikesCount(doc.data().likesCount || 0);
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [selectedPost, user.uid]);

    //* useEffect to get all the likes on a post from the firestore
    useEffect(() => {
        const unsubscribe = db.collection("Posts").doc(selectedPost).collection("likes").onSnapshot((querySnapshot) => {
            const likedUsersData = [];
            querySnapshot.forEach((doc) => {
                likedUsersData.push(doc.data());
            });
            setCurrentUserLiked(likedUsersData.some((likedUser) => likedUser.uid === user.uid));
        });

        return () => {
            unsubscribe();
        };
    }, [selectedPost, user.uid]);

    return (
        <div className="postPage">
            <div className="postPageInner">
                <div className="postPageInner_Top">
                    <div className="postPageInner_TopLeft">
                        <Avatar src={post.photoURL} />
                        <div className="userpostInfo">
                            <div className='userpostInfoTop'>
                                {user.uid === post.uid ? (
                                    <NavLink to="/userhomepage/post">
                                        <h4>{post.username}</h4>
                                    </NavLink>
                                ) : (
                                    <NavLink to={`/profilepage/${post.uid}/post`}>
                                        <h4>{post.username}</h4>
                                    </NavLink>
                                )}
                            </div>

                            <div className='userpostInfoBottom'>
                                <p>{timeAgo(post.timestamp)}</p>
                                <span>·</span>
                                <PublicIcon />
                            </div>
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
                        {post.media === '' ? (
                            <p></p>
                        ) : (
                            post.mediaType === 'image' ? (
                                <img src={post.media} alt="postMedia" />
                            ) : post.mediaType === 'video' ? (
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
                            {post.likesCount !== 0 ? (
                                post.likesCount > 1 ? (
                                    <p>{post.likesCount} likes</p>
                                ) : (
                                    <p>{post.likesCount} like</p>
                                )
                            ) : (
                                <p></p>
                            )}

                            {comments.length !== 0 ? (
                                comments.length > 1 ? (
                                    <p>{comments.length} comments</p>
                                ) : (
                                    <p>{comments.length} comment</p>
                                )
                            ) : (
                                <p></p>
                            )}
                        </div>

                        <div className="postPageInner_MiddleBottom_Bottom">
                            <div className='postPageInner_MiddleBottom_BottomOption' onClick={handleLike}>
                                {currentUserLiked ? (
                                    <>
                                        <ThumbUpIcon style={{ color: 'blue' }} />
                                        <p style={{ color: 'blue' }}>Like</p>
                                    </>
                                ) : (
                                    <>
                                        <ThumbUpAltOutlinedIcon />
                                        <p>Like</p>
                                    </>
                                )}
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
                        {visibleComments.map((comment) => (
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

                        {!showAllComments && comments.length > 5 && (
                            <button id="showAllBtn" onClick={handleShowComments}>View {comments.length - 5} more comments</button>
                        )}

                        {/* {showAllComments && comments.length > 5 && (
                            <button onClick={handleHideComments}>Show less</button>
                        )} */}
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