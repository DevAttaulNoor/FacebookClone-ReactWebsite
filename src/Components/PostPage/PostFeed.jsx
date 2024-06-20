import '../../CSS/PostPage/PostFeed.css';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setSelectedFriend } from '../../Redux/friendSlice';
import PostEdit from './PostEdit';
import PostLike from './PostLike';
import PostShare from './PostShare';
import PostComment from './PostComment';
import LazyLoadingImage from '../../Assets/Utility/LazyLoadingImage';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

function PostFeed({ key, id, userid, photoURL, media, mediaType, username, timestamp, message }) {
    Modal.setAppElement('#root');
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [post, setPost] = useState({});
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);
    const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [savedPost, setSavedPost] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleLikedUsersClick = () => {
        setIsLikedUsersModalOpen(true);
    };

    const handleLike = async () => {
        // Check if the user has already liked the post
        const likedUsersRef = db.collection("Posts").doc(id).collection("likes");
        const likedUserDoc = await likedUsersRef.doc(user.uid).get();

        if (likedUserDoc.exists) {
            // User has previously liked the post, so we should unlike it
            // Update the likes count in Firestore and remove the user's like information
            db.collection("Posts")
                .doc(id)
                .update({ likesCount: Math.max(likesCount - 1, 0) })
                .catch((error) => {
                    console.error("Error unliking post: ", error);
                });

            db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Likes').doc(id).delete();

            likedUserDoc.ref
                .delete()
                .catch((error) => {
                    console.error("Error removing like information: ", error);
                });
        } else {
            // User has not liked the post before, so we should like it
            // Update the likes count in Firestore and add the user's like information
            db.collection("Posts")
                .doc(id)
                .update({ likesCount: likesCount + 1 })
                .catch((error) => {
                    console.error("Error liking post: ", error);
                });

            if (user.uid !== userid) {
                db.collection("Users").doc(userid).collection("Notifications").doc(userid).collection('Likes').doc(id).set({
                    postid: id,
                    postuserid: userid,
                    userid: user.uid,
                    username: user.username,
                    userphotoUrl: user.photoURL,
                    timestamp: Math.floor(new Date().getTime() / 1000),
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

    const handleDelete = async () => {
        const postRef = db.collection("Posts").doc(id);

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

    const handleSavePost = async () => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedItems").doc(id).set({
                postId: id,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });
            console.log("Document successfully saved");
            setSavedPost(true);
        } catch (error) {
            console.error("Error saving document: ", error);
        }
    };

    const handleDelSavePost = async () => {
        try {
            await db.collection("Users").doc(user.uid).collection("SavedItems").doc(id).delete();
            console.log("Document successfully deleted");
            setSavedPost(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleFriendSelection = (friendUid) => {
        sessionStorage.setItem('selectedFriend', JSON.stringify({ friendUid: friendUid }));
        dispatch(setSelectedFriend(friendUid));
    }

    //* useEffect to close the dropdown when a click occurs outside of the area
    useEffect(() => {
        // Function to close the dropdown when a click occurs outside of it
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //* useEffect to get all the likes on a post from the firestore
    useEffect(() => {
        const unsubscribe = db.collection("Posts").doc(id).collection("likes").onSnapshot((querySnapshot) => {
            const likedUsersData = [];
            querySnapshot.forEach((doc) => {
                likedUsersData.push(doc.data());
            });
            setCurrentUserLiked(likedUsersData.some((likedUser) => likedUser.uid === user.uid));
        });

        return () => {
            unsubscribe();
        };
    }, [id, user.uid]);

    //* useEffect to get all the like count on a post from the firestore
    useEffect(() => {
        const postRef = db.collection("Posts").doc(id);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setLikesCount(doc.data().likesCount || 0);
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [id, user.uid]);

    //* useEffect to get all the comments on a post from the firestore
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

    //* useEffect to get all the savedposts from the firestore
    useEffect(() => {
        if (user && user.uid && id) {
            const checkIfPostExists = async () => {
                const savedPostsRef = db.collection("Users").doc(user.uid).collection("SavedItems");
                const snapshot = await savedPostsRef.where("postId", "==", id).get();

                if (!snapshot.empty) {
                    setSavedPost(true);
                } else {
                    setSavedPost(false);
                }
            };
            checkIfPostExists();
        }
    }, [id, savedPost, user]);

    //* useEffect to get all the posts from the firestore
    useEffect(() => {
        const postRef = db.collection('Posts').doc(id);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPost(doc.data());
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [id]);

    return (
        <div className='postfeed' key={key}>
            <div className="postfeedTop">
                <div className="postfeedTopLeft">
                    <Avatar src={photoURL} />

                    <div className="postUserInfo">
                        <div className='postUserInfoTop'>
                            {user.uid === userid ? (
                                <NavLink to={`/userhomepage/post`}>
                                    <h4>{username}</h4>
                                </NavLink>
                            ) : (
                                <NavLink to={`/profilepage/${userid}/post`} onClick={() => handleFriendSelection(userid)}>
                                    <h4>{username}</h4>
                                </NavLink>
                            )}
                        </div>

                        <div className='postUserInfoBottom'>
                            <p>{timestamp}</p>
                            <span>·</span>
                            <PublicIcon />
                        </div>
                    </div>
                </div>

                <div className='postfeedTopRight' onClick={toggleDropdown} ref={dropdownRef}>
                    <MoreHorizIcon />
                    {user.uid === post.uid ? (
                        <>
                            {isDropdownVisible && (
                                <div className="postSetting">
                                    <div className="postSettingOption" onClick={handleDelete}>
                                        <div className="postSettingOptionLeft">
                                            <i id='deletePostIcon'></i>
                                        </div>
                                        <div className="postSettingOptionRight">
                                            <h5>Move to trash</h5>
                                            <p>Items in your trash are deleted.</p>
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <div className="postSettingOption" onClick={() => setIsEditing(true)}>
                                            <div className="postSettingOptionLeft">
                                                <i id='editPostIcon'></i>
                                            </div>
                                            <div className="postSettingOptionRight">
                                                <h5>Edit post</h5>
                                                <p>Edit your post</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {isDropdownVisible && (
                                <div className="postSetting">
                                    {savedPost === false ? (
                                        <div className="postSettingOption" onClick={handleSavePost}>
                                            <div className="postSettingOptionLeft">
                                                <i id='savePostIcon'></i>
                                            </div>
                                            <div className="postSettingOptionRight">
                                                <h5>Save post</h5>
                                                <p>Add this to your saved items.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="postSettingOption" onClick={handleDelSavePost}>
                                            <div className="postSettingOptionLeft">
                                                <i id='unsavePostIcon'></i>
                                            </div>
                                            <div className="postSettingOptionRight">
                                                <h5>Unsave post</h5>
                                                <p>Remove this from your saved items.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="postfeedMiddle">
                <div className='postfeedMiddleTop'>
                    {message && (
                        <div id="postMsg" style={{ fontSize: media ? '15px' : '30px' }}>
                            {message}
                        </div>
                    )}

                    {media && mediaType === 'image' && (
                        <LazyLoadingImage
                            alt={"postImage"}
                            effect={'blur'}
                            lowResSrc={media}
                            highResSrc={media}
                            className={'postImg'}
                        />
                    )}

                    {media && mediaType === 'video' && (
                        <video id="postVideo" controls>
                            <source src={media} type="video/mp4" />
                        </video>
                    )}

                    {isEditing && (
                        <Modal className="postEditModal" isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                            <PostEdit id={id} media={media} mediaType={mediaType} message={message} close={() => setIsEditing(false)} />
                        </Modal>
                    )}
                </div>

                <div className="postfeedMiddleBottom">
                    {likesCount >= 1 && <p onClick={handleLikedUsersClick}> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'} </p>}
                    {comments.length >= 1 && <p onClick={() => setIsCommentModalOpen(true)}> {comments.length} {comments.length === 1 ? 'comment' : 'comments'} </p>}
                </div>
            </div>

            <div className="postfeedBottom">
                <div className='postfeedBottomOptions'>
                    <div className='postfeedBottomOption' onClick={handleLike}>
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

                    <div className='postfeedBottomOption' onClick={() => setIsCommentModalOpen(true)}>
                        <ChatBubbleOutlineOutlinedIcon />
                        <p>Comment</p>
                    </div>

                    <div className='postfeedBottomOption' onClick={() => setIsShareModalOpen(true)}>
                        <ReplyOutlinedIcon />
                        <p>Share</p>
                    </div>
                </div>

                <div className="postfeedBottomModals">
                    <Modal className="likedUserModal" isOpen={isLikedUsersModalOpen} onRequestClose={() => setIsLikedUsersModalOpen(false)}>
                        <PostLike
                            id={id}
                            closeModal={{ closeLikeModal: () => setIsLikedUsersModalOpen(false) }}
                        />
                    </Modal>

                    <Modal className="commentedUserModal" isOpen={isCommentModalOpen} onRequestClose={() => setIsCommentModalOpen(false)}>
                        <PostComment
                            id={id}
                            userid={userid}
                            closeModal={{ closeCommentModal: () => setIsCommentModalOpen(false) }}
                        />
                    </Modal>

                    <Modal className="sharedUserModal" isOpen={isShareModalOpen} onRequestClose={() => setIsShareModalOpen(false)}>
                        <PostShare closeModal={() => setIsShareModalOpen(false)} />
                    </Modal>
                </div>
            </div>
        </div >
    )
}

export default PostFeed;