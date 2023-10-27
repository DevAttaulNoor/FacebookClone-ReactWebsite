import '../../CSS/HomePage/HomePage_Feeds_Posts.css';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material';
import { db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import HomePage_Feeds_Posts_ShareModal from './HomePage_Feeds_Posts_ShareModal';
import HomePage_Feeds_Posts_CommentModal from './HomePage_Feeds_Posts_CommentModal';
import HomePage_Feeds_Posts_LikeModal from './HomePage_Feeds_Posts_LikeModal';
import Modal from 'react-modal';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';

function HomePage_Feeds_Posts({ id, photoURL, image, video, username, timestamp, message }) {
    Modal.setAppElement('#root');

    const [{ user }] = useStateValue();
    const [post, setPost] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [editedVideo, setEditedVideo] = useState(video);
    const [progress, setProgress] = useState(0);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);
    const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedMessage(message);
        setEditedImage(image);
        setEditedVideo(video);
    };

    const handleSave = async () => {
        const postRef = db.collection("Posts").doc(id);
        const updateData = {};

        if (editedMessage !== message) {
            updateData.message = editedMessage;
        }

        if (imageFile) {
            const imageStorageRef = storage.ref(`Posts/${user.uid}/${imageFile.name}`);
            await imageStorageRef.put(imageFile);
            const imageUrl = await imageStorageRef.getDownloadURL();
            updateData.image = imageUrl;
        }

        if (videoFile) {
            const videoStorageRef = storage.ref(`Posts/${user.uid}/${videoFile.name}`);
            await videoStorageRef.put(videoFile);
            const videoUrl = await videoStorageRef.getDownloadURL();
            updateData.video = videoUrl;
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

    const getLikedUsers = async () => {
        const likedUsersRef = db.collection("Posts").doc(id).collection("likes");
        const querySnapshot = await likedUsersRef.get();

        const likedUsersData = [];
        querySnapshot.forEach((doc) => {
            likedUsersData.push(doc.data());
        });

        setLikedUsers(likedUsersData);
    };

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

    const handleLikedUsersClick = () => {
        getLikedUsers();
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
                        setEditedImage(url);
                        setImageFile(file);
                    }

                    else if (file.type.startsWith("video/")) {
                        setEditedVideo(url);
                        setVideoFile(file);
                    }
                });
            });
        }

        else {
            setEditedImage(null);
            setEditedVideo(null);
        }
    };

    useEffect(() => {
        const likedUsersRef = db.collection("Posts").doc(id).collection("likes");

        // Add a snapshot listener to listen for changes in the "likes" subcollection
        const unsubscribe = likedUsersRef.onSnapshot((querySnapshot) => {
            const likedUsersData = [];
            querySnapshot.forEach((doc) => {
                likedUsersData.push(doc.data());
            });
            setLikedUsers(likedUsersData);

            // Check if the current user has liked the post and set a flag accordingly
            const currentUserLiked = likedUsersData.some((likedUser) => likedUser.uid === user.uid);
            setCurrentUserLiked(currentUserLiked);
        });

        return () => {
            unsubscribe();
        };
    }, [id, user.uid]);

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
        <div className='homepageFeedsPosts'>
            <div className="homepageFeedsPosts_Top">
                <div className="homepageFeedsPosts_TopLeft">
                    <Avatar src={photoURL} />
                    <div className="userpostInfo">
                        <h4>{username}</h4>
                        <p>{timestamp} <PublicIcon /></p>
                    </div>
                </div>

                <div className={`homepageFeedsPosts_TopRight ${isDropdownClicked ? 'clicked' : ''}`} onClick={toggleDropdown} ref={dropdownRef}>
                    <MoreHorizIcon />
                    {isDropdownVisible && (
                        <div className="postSetting">
                            <button onClick={handleDelete}>Delete the post</button>
                            {!isEditing && <button onClick={handleEdit}>Edit the post</button>}
                        </div>
                    )}
                </div>
            </div>

            <div className="homepageFeedsPosts_Middle">
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

                                    {editedImage ? (
                                        <img id="editedImg" src={editedImage} alt="Edited" />
                                    ) : editedVideo ? (
                                        <video id="editedVideo" controls> <source src={editedVideo} type="video/mp4" /> </video>
                                    ) : image ? (
                                        <img id="originalImg" src={image} alt="Original" />
                                    ) : video ? (
                                        <video id="originalVideo" controls> <source src={video} type="video/mp4" /> </video>
                                    ) : (
                                        <p id='noMedia'>No media selected</p>
                                    )}
                                </div>
                                {progress != "" && <progress className='post_progress' value={progress} max="100" />}


                                <div className="EditModal_Bottom">
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        </Modal>
                    ) : (
                        <div className='homepageFeedsPosts_MiddleTopInner'>
                            {message && <p id="postMsg" style={{ fontSize: image || video ? '15px' : '30px' }}> {editedMessage} </p>}
                            {image && <img id="postImg" src={editedImage} alt="Image" />}
                            {video && (<video id="postVideo" controls> <source src={editedVideo} type="video/mp4" /> </video>)}
                        </div>
                    )}
                </div>

                <div className="homepageFeedsPosts_MiddleBottom">
                    {likesCount >= 1 && <p onClick={handleLikedUsersClick}> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'} </p>}
                    {comments.length >= 1 && <p onClick={openCommentModal}> {comments.length} {comments.length === 1 ? 'comment' : 'comments'} </p>}
                </div>
            </div>

            <div className="homepageFeedsPosts_Bottom">
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
                        <HomePage_Feeds_Posts_LikeModal
                            id={id}
                            closeModal={{ closeLikeModal: () => setIsLikedUsersModalOpen(false) }}
                        />
                    </Modal>

                    <Modal className="commentedUserModal" isOpen={isCommentModalOpen} onRequestClose={() => setIsCommentModalOpen(false)}>
                        <HomePage_Feeds_Posts_CommentModal
                            id={id}
                            closeModal={{ closeCommentModal: () => setIsCommentModalOpen(false) }}
                        />
                    </Modal>

                    <Modal className="sharedUserModal" isOpen={isShareModalOpen} onRequestClose={() => setIsShareModalOpen(false)}>
                        <HomePage_Feeds_Posts_ShareModal closeModal={() => setIsShareModalOpen(false)} />
                    </Modal>
                </div>
            </div>
        </div >
    )
}

export default HomePage_Feeds_Posts