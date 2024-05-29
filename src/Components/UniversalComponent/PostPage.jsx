import "../../CSS/UniversalComponent/PostPage.css";
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { Avatar } from '@mui/material';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { db } from "../../Firebase/firebase";
import { setSelectedFriend } from "../../Redux/friendSlice";
import PostLike from "../Post/PostLike";
import PostShare from "../Post/PostShare";
import PostComment from "../Post/PostComment";
import SendIcon from '@mui/icons-material/Send';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

function PostPage() {
    Modal.setAppElement('#root');
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const selectedPost = useSelector((state) => state.data.post.selectedPost);
    const [post, setPost] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false)
    const visibleComments = showAllComments ? comments : comments.slice(0, 5);
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
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

            if (user.uid !== post.uid) {
                db.collection("Users").doc(post.uid).collection("Notifications").doc(post.uid).collection('Likes').doc(selectedPost).set({
                    postid: selectedPost,
                    postuserid: post.uid,
                    userid: user.uid,
                    username: user.username,
                    userphotoUrl: user.photoURL,
                    timestamp: new Date(),
                    status: 'reacted',
                    notificationStatus: 'notseen',
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

    const handleLikedUsersClick = () => {
        setIsLikedUsersModalOpen(true);
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

    const handleFriendSelection = (friendUid) => {
        sessionStorage.setItem('selectedFriend', JSON.stringify({ friendUid: friendUid }));
        dispatch(setSelectedFriend(friendUid));
    }

    const handleDelete = async () => {
        const postRef = db.collection("Posts").doc(selectedPost);

        // Delete the post document
        try {
            await postRef.delete();
            console.log("Post document successfully deleted!");
        } catch (error) {
            console.error("Error removing post document: ", error);
        }

        // Delete the "likes" subcollection
        const likesRef = postRef.collection("likes");
        const deleteLikesPromise = likesRef.get()
            .then((querySnapshot) => {
                const batch = db.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .catch((error) => {
                console.error("Error removing likes subcollection: ", error);
            });

        // Delete all comments in the collection
        const commentsRef = postRef.collection("comments");
        const deleteCommentsPromise = commentsRef.get()
            .then((querySnapshot) => {
                const batch = db.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .catch((error) => {
                console.error("Error removing comments: ", error);
            });

        // Use Promise.all to wait for all delete operations to complete
        try {
            await Promise.all([deleteLikesPromise, deleteCommentsPromise]);
            console.log("Likes subcollection and comments successfully deleted!");
        } catch (error) {
            console.error("Error deleting likes subcollection and comments: ", error);
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

            return () => {
                commentsRef();
            };
        };

        getRealtimeComments();
    }, [selectedPost]);

    //* useEffect to close the dropdown when a click occurs outside of the area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

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
                        <div className="postUserInfo">
                            <div className='postUserInfoTop'>
                                {user.uid === post.uid ? (
                                    <NavLink to="/userhomepage/post">
                                        <h4>{post.username}</h4>
                                    </NavLink>
                                ) : (
                                    <NavLink to={`/profilepage/${post.uid}/post`} onClick={() => handleFriendSelection(post.uid)}>
                                        <h4>{post.username}</h4>
                                    </NavLink>
                                )}
                            </div>

                            <div className='postUserInfoBottom'>
                                <p>{timeAgo(post.timestamp)}</p>
                                <span>·</span>
                                <PublicIcon />
                            </div>
                        </div>
                    </div>

                    <div className="postPageInner_TopRight" onClick={toggleDropdown}>
                        <MoreHorizIcon />
                        {isDropdownVisible && (
                            <div className="postSetting" ref={dropdownRef}>
                                <div className="postSettingOption" onClick={handleDelete}>
                                    <div className="postSettingOptionLeft">
                                        <i id='deletePostIcon'></i>
                                    </div>
                                    <div className="postSettingOptionRight">
                                        <h5>Move to trash</h5>
                                        <p>Items in your trash are deleted.</p>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            {post.likesCount >= 1 && <p onClick={handleLikedUsersClick}> {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'} </p>}
                            {comments.length >= 1 && <p onClick={() => setIsCommentModalOpen(true)}> {comments.length} {comments.length === 1 ? 'comment' : 'comments'} </p>}
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

                            <div className='postPageInner_MiddleBottom_BottomOption' onClick={() => setIsShareModalOpen(true)}>
                                <ReplyOutlinedIcon />
                                <p>Share</p>
                            </div>
                        </div>

                        <div className="postBottomModals">
                            <Modal className="likedUserModal" isOpen={isLikedUsersModalOpen} onRequestClose={() => setIsLikedUsersModalOpen(false)}>
                                <PostLike
                                    id={selectedPost}
                                    closeModal={{ closeLikeModal: () => setIsLikedUsersModalOpen(false) }}
                                />
                            </Modal>

                            <Modal className="commentedUserModal" isOpen={isCommentModalOpen} onRequestClose={() => setIsCommentModalOpen(false)}>
                                <PostComment
                                    id={selectedPost}
                                    userid={post.uid}
                                    closeModal={{ closeCommentModal: () => setIsCommentModalOpen(false) }}
                                />
                            </Modal>

                            <Modal className="sharedUserModal" isOpen={isShareModalOpen} onRequestClose={() => setIsShareModalOpen(false)}>
                                <PostShare closeModal={() => setIsShareModalOpen(false)} />
                            </Modal>
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
                                        {comment.uid === user.uid && <button onClick={() => deleteComment(comment.id)}>Delete</button>}
                                        <p>{timeAgowithInitials(comment.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!showAllComments && comments.length > 5 && (
                            <button id="showAllBtn" onClick={handleShowComments}>View {comments.length - 5} more comments</button>
                        )}
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