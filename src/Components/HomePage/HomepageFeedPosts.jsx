import '../../CSS/HomePage/HomepageFeedPosts.css';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import firebase from "firebase/compat/app";
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import Skeleton from '../Skeletons/Skeleton';
import Skeleton_UserInfo from '../Skeletons/Skeleton_UserInfo';
import HomepageFeedPostsCmtModal from './HomepageFeedPostsCmtModal';
import HomepageFeedPostsLikeModal from './HomepageFeedPostsLikeModal';
import HomepageFeedPostsShareModal from './HomepageFeedPostsShareModal';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { setSelectedFriend } from '../../Redux/friendSlice';

function HomepageFeedPosts({ id, userid, photoURL, media, mediaType, username, timestamp, message }) {
    Modal.setAppElement('#root');
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [post, setPost] = useState({});
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [mediaFile, setMediaFile] = useState(null)
    const [editedMedia, setEditedMedia] = useState(media)
    const [mediaFileType, setMediaFileType] = useState(null)
    const [editedMediaFileType, setEditedMediaFileType] = useState(mediaType)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);
    const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedPost, setSavedPost] = useState(false);
    const dropdownRef = useRef(null);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedMedia(media);
        setEditedMessage(message);
        setMediaFileType(mediaType);
    };

    const handleSave = async () => {
        const postRef = db.collection("Posts").doc(id);
        const updateData = {};

        if (editedMessage !== message) {
            updateData.message = editedMessage;
        }

        if (mediaFile) {
            const StorageRef = storage.ref(`Posts/${user.uid}/${mediaFile.name}`);
            await StorageRef.put(mediaFile);
            const mediaUrl = await StorageRef.getDownloadURL();
            updateData.media = mediaUrl;

            if (mediaFile.type.startsWith("image/")) {
                setMediaFileType('image')
                updateData.mediaType = 'image';
                console.log("Media Type is image!");
            }

            else if (mediaFile.type.startsWith("video/")) {
                setMediaFileType('video')
                updateData.mediaType = 'video';
                console.log("Media Type is video!");
            }

            else {
                setMediaFileType('invalid')
                updateData.mediaType = 'invalid';
                console.log("Media Type is invalid!");
            }
        }

        else if ((editedMessage !== message) && (mediaFile)) {
            updateData.message = editedMessage;

            const StorageRef = storage.ref(`Posts/${user.uid}/${mediaFile.name}`);
            await StorageRef.put(mediaFile);
            const mediaUrl = await StorageRef.getDownloadURL();
            updateData.media = mediaUrl;

            if (mediaFile.type.startsWith("image/")) {
                setMediaFileType('image')
                updateData.mediaType = 'image';
                console.log("Media Type is image!");
            }

            else if (mediaFile.type.startsWith("video/")) {
                setMediaFileType('video')
                updateData.mediaType = 'video';
                console.log("Media Type is video!");
            }

            else {
                setMediaFileType('invalid')
                updateData.mediaType = 'invalid';
                console.log("Media Type is invalid!");
            }
        }

        if (Object.keys(updateData).length > 0) {
            try {
                await postRef.update(updateData);
                console.log("Media URLs in Firestore updated successfully!");
                setIsEditing(false);
                setIsDropdownVisible(false);
            }

            catch (error) {
                console.error("Error updating media URLs in Firestore: ", error);
            }
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

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
        setIsDropdownClicked(!isDropdownClicked);
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

    const openCommentModal = () => {
        setIsCommenting(true);
        setIsCommentModalOpen(true);
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const storageRef = storage.ref(`Posts/${user.uid}/${file.name}`);
            storageRef.put(file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {
                    if (file.type.startsWith("image/")) {
                        setEditedMediaFileType('image')
                        setEditedMedia(url);
                        setMediaFile(file)
                    }

                    else if (file.type.startsWith("video/")) {
                        setEditedMediaFileType('video')
                        setEditedMedia(url);
                        setMediaFile(file)
                    }
                });
            });
        }

        else {
            setEditedMedia(null);
            setEditedMediaFileType(null);
        }
    };

    const handleSavePost = () => {
        db.collection("Users").doc(user.uid).collection("SavedPosts").add({
            postid: id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    const handleDelSavePost = () => {
        db.collection("Users").doc(user.uid).collection("SavedPosts").doc(id).delete()
            .then(() => {
                console.log("Document successfully deleted");
            })
            .catch((error) => {
                console.error("Error deleting document: ", error);
            });
    }

    //* useEffect to get all the savedposts from the firestore
    useEffect(() => {
        if (user && user.uid && id) {
            const checkIfPostExists = async () => {
                const savedPostsRef = db.collection("Users").doc(user.uid).collection("SavedPosts");
                const snapshot = await savedPostsRef.where("postid", "==", id).get();

                if (!snapshot.empty) {
                    setSavedPost(true);
                } else {
                    setSavedPost(false);
                }
            };
            checkIfPostExists();
        }
    }, [user, savedPost, id]);

    //* useEffect to get all the posts from the firestore
    useEffect(() => {
        setLoading(true);
        const postRef = db.collection('Posts').doc(id);

        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPost(doc.data());
                setLoading(false);
            }
        });

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts
            unsubscribe();
        };
    }, [id]);

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

    //* useEffect to get all the users from the firestore
    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
            try {
                const usersCollection = await db.collection('Users').get();
                const usersData = usersCollection.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            }

            catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
        setLoading(false);
    }, []);

    //* useEffect to prevent background scrolling when popup modal is open
    useEffect(() => {
        if (isCommentModalOpen || isShareModalOpen || isLikedUsersModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        // Cleanup function to remove the class when the component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isCommentModalOpen, isShareModalOpen, isLikedUsersModalOpen]);

    return (
        <div className='homepageFeedsPosts'>
            <div className="homepageFeedsPosts_Top">
                {loading ? (
                    <Skeleton_UserInfo />
                ) : (
                    <>
                        <div className="homepageFeedsPosts_TopLeft">
                            <Avatar src={photoURL} />
                            <div className="userpostInfo">
                                <div className='userpostInfoTop'>
                                    {user.uid === userid ? (
                                        <NavLink to={`/userhomepage/post`}>
                                            <h4>{username}</h4>
                                        </NavLink>
                                    ) : (
                                        <NavLink to={`/profilepage/${userid}/post`} onClick={() => dispatch(setSelectedFriend(userid))}>
                                            <h4>{username}</h4>
                                        </NavLink>
                                    )}
                                </div>

                                <div className='userpostInfoBottom'>
                                    <p>{timestamp}</p>
                                    <span>·</span>
                                    <PublicIcon />
                                </div>
                            </div>
                        </div>

                        <div className={`homepageFeedsPosts_TopRight ${isDropdownClicked ? 'clicked' : ''}`} onClick={toggleDropdown} ref={dropdownRef}>
                            <MoreHorizIcon />
                            {user.uid === post.uid ? (
                                <div>
                                    {isDropdownVisible && (
                                        <div className="postSetting">
                                            <button onClick={handleDelete}>Delete the post</button>
                                            {!isEditing && <button onClick={handleEdit}>Edit the post</button>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {isDropdownVisible && (
                                        <div className="postSetting">
                                            {savedPost === false ? (
                                                <button onClick={handleSavePost}>Save the post</button>
                                            ) : (
                                                <button onClick={handleDelSavePost}>Unsave the post</button>
                                            )}
                                            <button>Report the post</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="homepageFeedsPosts_Middle">
                {loading ? (
                    <Skeleton type='square' />
                ) : (
                    <>
                        <div className='homepageFeedsPosts_MiddleTop'>
                            {isEditing ? (
                                <Modal className="editModal" isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                                    <div className='EditModal'>
                                        <div className="EditModal_Top">
                                            <h2>Edit Post</h2>
                                        </div>

                                        <div className="EditModal_Middle">
                                            <input id="msgInput" type="text" value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} />
                                            <input id="mediaInput" type="file" accept="image/*,video/*" onChange={handleMediaUpload} style={{ display: 'none' }} />
                                            <label id="mediaInputLabel" htmlFor="mediaInput">Select Media</label>

                                            {editedMedia ? (
                                                editedMediaFileType === 'image' ? (
                                                    <img id="editedImg" src={editedMedia} alt="Edited" />
                                                ) : editedMediaFileType === 'video' ? (
                                                    <video id="editedVideo" controls>
                                                        <source src={editedMedia} type="video/mp4" />
                                                    </video>
                                                ) : (
                                                    <p id='noMedia'>Invalid media type</p>
                                                )
                                            ) : (
                                                media ? (
                                                    mediaFileType === 'image' ? (
                                                        <img id="originalImg" src={media} alt="Original" />
                                                    ) : mediaFileType === 'video' ? (
                                                        <video id="originalVideo" controls>
                                                            <source src={media} type="video/mp4" />
                                                        </video>
                                                    ) : (
                                                        <p id='noMedia'>Invalid media type</p>
                                                    )
                                                ) : (
                                                    <p id='noMedia'>No media selected</p>
                                                )
                                            )}
                                        </div>

                                        <div className="EditModal_Bottom">
                                            <button onClick={handleSave}>Save</button>
                                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </Modal>
                            ) : (
                                <div className='homepageFeedsPosts_MiddleTopInner'>
                                    {message && <div id="postMsg" style={{ fontSize: media ? '15px' : '30px' }}> {editedMessage} </div>}
                                    {media && mediaType === 'image' && <img id="postImg" src={editedMedia} alt="postImage" />}
                                    {media && mediaType === 'video' && (
                                        <video id="postVideo" controls>
                                            <source src={editedMedia} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="homepageFeedsPosts_MiddleBottom">
                            {likesCount >= 1 && <p onClick={handleLikedUsersClick}> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'} </p>}
                            {comments.length >= 1 && <p onClick={openCommentModal}> {comments.length} {comments.length === 1 ? 'comment' : 'comments'} </p>}
                        </div>
                    </>
                )}
            </div>

            <div className="homepageFeedsPosts_Bottom">
                {loading ? (
                    <div className='skeletonPost_Bottom'>
                        <Skeleton type='halfText' />
                        <Skeleton type='halfText' />
                        <Skeleton type='halfText' />
                    </div>
                ) : (
                    <>
                        <div className='homepageFeedsPosts_BottomInner'>
                            <div className='homepageFeedsPosts_BottomOption' onClick={handleLike}>
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

                            <div className='homepageFeedsPosts_BottomOption' onClick={openCommentModal}>
                                <ChatBubbleOutlineOutlinedIcon />
                                <p>Comment</p>
                            </div>

                            <div className='homepageFeedsPosts_BottomOption' onClick={() => setIsShareModalOpen(true)}>
                                <ReplyOutlinedIcon />
                                <p>Share</p>
                            </div>
                        </div>

                        <div className="homepageFeedsPosts_BottomModals">
                            <Modal className="likedUserModal" isOpen={isLikedUsersModalOpen} onRequestClose={() => setIsLikedUsersModalOpen(false)}>
                                <HomepageFeedPostsLikeModal
                                    id={id}
                                    closeModal={{ closeLikeModal: () => setIsLikedUsersModalOpen(false) }}
                                />
                            </Modal>

                            <Modal className="commentedUserModal" isOpen={isCommentModalOpen} onRequestClose={() => setIsCommentModalOpen(false)}>
                                <HomepageFeedPostsCmtModal
                                    id={id}
                                    userid={userid}
                                    closeModal={{ closeCommentModal: () => setIsCommentModalOpen(false) }}
                                />
                            </Modal>

                            <Modal className="sharedUserModal" isOpen={isShareModalOpen} onRequestClose={() => setIsShareModalOpen(false)}>
                                <HomepageFeedPostsShareModal closeModal={() => setIsShareModalOpen(false)} />
                            </Modal>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default HomepageFeedPosts;