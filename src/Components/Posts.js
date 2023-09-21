import "../CSS/Posts.css"
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material'
import { db, storage } from './Firebase'
import { useStateValue } from './StateProvider';
import Modal from 'react-modal';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function Posts({ id, photoURL, image, username, timestamp, message }) {
    Modal.setAppElement('#root');

    const [{ user }, dispatch] = useStateValue();
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const dropdownRef = useRef(null);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedImage !== null && editedImage !== undefined) {
            const uploadTask = storage.ref(`Images/Posts/${user.uid}/${editedImage.name}`).put(editedImage);

            uploadTask.then((snapshot) => snapshot.ref.getDownloadURL()).then((url) => {
                const updatedData = {
                    message: editedMessage,
                    image: url,
                };

                // Update the Firestore document with the edited data, including the image URL
                return db.collection("Posts").doc(id).update(updatedData);
            })
                .then(() => {
                    console.log("Document successfully updated!");
                    setIsEditing(false);
                    setIsDropdownVisible(false);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }

        else {
            // No new image to upload, update the Firestore document with the edited message only
            if (editedMessage !== message) {
                db.collection("Posts").doc(id).update({
                    message: editedMessage,
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                        setIsEditing(false);
                        setIsDropdownVisible(false);
                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            }
            else {
                // No changes were made, so simply close the editing form
                setIsEditing(false);
                setIsDropdownVisible(false);
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const storageRef = storage.ref(`Images/Posts/${user.uid}/${file.name}`);

            storageRef.put(file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {
                    setEditedImage(url);
                    setImageFile(file);

                    db.collection("Posts").doc(id).update({
                        image: url
                    })
                        .then(() => {
                            console.log("Image URL in Firestore updated successfully!");
                        })
                        .catch((error) => {
                            console.error("Error updating image URL in Firestore: ", error);
                        });
                });
            });
        }
        else {
            // If no file is selected (e.g., user canceled the upload), reset editedImage to null
            setEditedImage(null);
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
                    username: user.displayName,
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
    }, [id]);

    const handleLikedUsersClick = () => {
        getLikedUsers();
        setIsLikedUsersModalOpen(true);
    };

    const openCommentInput = () => {
        setIsCommenting(true);
        setIsCommentModalOpen(true);
    };

    const openCommentModal = () => {
        setIsCommentModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
    };

    const postComment = async () => {
        if (comment.trim() === '') {
            return;
        }

        const newComment = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: comment,
            timestamp: new Date(),
        };

        try {
            await db.collection("Posts").doc(id).collection("comments").add(newComment);
            setComment('');
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

    const deleteComment = (commentId) => {
        db.collection("Posts").doc(id).collection("comments").doc(commentId).delete().then(() => {
            console.log("Comment successfully deleted!");
        })
            .catch((error) => {
                console.error("Error removing comment: ", error);
            });
    };

    const openShareDialog = () => {
        setIsShareDialogOpen(true);
    };

    const closeShareDialog = () => {
        setIsShareDialogOpen(false);
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
        <div className='post'>
            {/* Post Top Section */}
            <div className="post_top">
                <div className="post_topleft">
                    <Avatar src={photoURL} />
                    <div className="postinfo">
                        <h4>{username}</h4>
                        <p>{timestamp} <PublicIcon /></p>
                    </div>
                </div>
                <div className={`post_topright ${isDropdownClicked ? 'clicked' : ''}`} onClick={toggleDropdown} ref={dropdownRef}>
                    <MoreHorizIcon />
                    {isDropdownVisible && (
                        <div className="dropdownMenu">
                            {/* Dropdown menu items go here */}
                            <button onClick={handleDelete}>Delete the post</button>
                            {!isEditing && <button onClick={handleEdit}>Edit the post</button>}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Middle Section */}
            <div className="post_middle">
                {isEditing ? (
                    <Modal className="post_editingModal" isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                        <h2>Edit Post</h2>
                        <input type="text" value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} />

                        <div className="editedImageContainer">
                            <div className="file-input-container">
                                <div className="image-url-container">
                                    <input type="text" value={editedImage || ''} readOnly />
                                </div>

                                <label htmlFor="file-input" className="file-input-label">Select Image</label>
                                <input className="file-input" type="file" id="file-input" accept="image/*" onChange={handleImageUpload} />
                            </div>
                            {editedImage ? (
                                <img className="edited-image" src={editedImage} alt="Edited" />
                            ) : image ? (
                                <img className="edited-image" src={image} alt="Original" />
                            ) : (
                                <p className="noEditedimg">No image selected</p>
                            )}
                        </div>

                        <div className="btns">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </Modal>
                ) : (
                    <div>
                        <p id="post_middleMessage" style={{ fontSize: image ? '15px' : '30px' }}>{editedMessage}</p>
                        {image && <img id="post_middleImg" src={editedImage} />}
                    </div>
                )}

                <div className="post_ReactInfo">
                    {likesCount >= 1 && <p onClick={handleLikedUsersClick}> {likesCount} {likesCount === 1 ? 'Like' : 'Likes'} </p>}
                    {comments.length >= 1 && <p onClick={openCommentModal}> {comments.length} {comments.length === 1 ? 'comment' : 'comments'} </p>}
                </div>
            </div>

            {/* Post Bottom Section */}
            <div className="post_bottom">
                {/* Modals for Like, Comment and Share */}
                <div className="post_bottomModals">
                    <Modal className="Modal" id="post_likeduserModal" isOpen={isLikedUsersModalOpen} onRequestClose={() => setIsLikedUsersModalOpen(false)}>
                        <div className="modalTop">
                            <CloseIcon onClick={() => setIsLikedUsersModalOpen(false)} />
                            <p>Reactions</p>
                            <hr className="line" />
                        </div>

                        <div className="modalMiddle">
                            {likedUsers.map((user) => (
                                <div key={user.uid} className="post_likes">
                                    <Avatar src={user.photoUrl} />
                                    <span>{user.username}</span>
                                </div>
                            ))}
                        </div>
                    </Modal>

                    <Modal className="Modal" id="post_commentModal" isOpen={isCommentModalOpen} onRequestClose={closeCommentModal}>
                        <div className="modalTop">
                            <CloseIcon onClick={closeCommentModal} />
                            <p>Comments</p>
                            <hr className="line" />
                        </div>

                        <div className="modalMiddle">
                            {comments.map((comment) => (
                                <div key={comment.id} className='post_comments'>
                                    <Avatar src={comment.photoURL} />
                                    <div className="post_commentInfo">
                                        <div className='post_commentInner'>
                                            <p className='post_commentUser'>{comment.displayName}</p>
                                            <p className='post_commentComment'>{comment.text}</p>
                                        </div>
                                        <div className='post_commentOuter'>
                                            <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                            <p className='post_commentTimestamp'>{timeAgowithInitials(comment.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modalBottom">
                            {isCommenting && (
                                <div className='post_commentInput'>
                                    <Avatar src={user.photoURL} />
                                    <input
                                        type='text'
                                        placeholder='Write a comment...'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <SendIcon onClick={postComment}/>
                                </div>
                            )}
                        </div>
                    </Modal>

                    <Modal className="Modal" id="post_shareModal" isOpen={isShareDialogOpen} onRequestClose={closeShareDialog}>
                        <div className="modalTop">
                            <CloseIcon onClick={closeShareDialog} />
                            <p>Shares</p>
                            <hr className="line" />
                        </div>
                    </Modal>
                </div>

                {/* Btns for Like, Comment and Share */}
                <div className='post_bottomOption' onClick={handleLike}>
                    <ThumbUpAltOutlinedIcon />
                    <p>Like</p>
                </div>
                <div className='post_bottomOption' onClick={openCommentInput}>
                    <ChatBubbleOutlineOutlinedIcon />
                    <p>Comment</p>
                </div>
                <div className='post_bottomOption' onClick={openShareDialog}>
                    <ReplyOutlinedIcon />
                    <p>Share</p>
                </div>
            </div>
        </div >
    )
}

export default Posts