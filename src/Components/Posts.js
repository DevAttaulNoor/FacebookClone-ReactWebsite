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

function Posts({ id, photoURL, image, username, timestamp, message }) {
    Modal.setAppElement('#root');

    const [{ user }, dispatch] = useStateValue();
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const dropdownRef = useRef(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);

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
    
    const handleDelete = () => {
        const commentsRef = db.collection("Posts").doc(id).collection("comments");

        // Delete all comments in the collection
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

        // Delete the post after comments are deleted
        const deletePostPromise = db.collection("Posts").doc(id).delete()
            .then(() => {
                console.log("Post document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing post document: ", error);
            });

        // Use Promise.all to wait for both delete operations to complete
        Promise.all([deleteCommentsPromise, deletePostPromise])
            .then(() => {
                console.log("Post and comments successfully deleted!");
            })
            .catch((error) => {
                console.error("Error deleting post and comments: ", error);
            });
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

    const handleLike = () => {
        setLiked(!liked);

        // Update the likes count in Firestore
        const updatedLikesCount = liked ? likesCount - 1 : likesCount + 1;
        db.collection("Posts").doc(id).update({ likesCount: updatedLikesCount });
    };

    useEffect(() => {
        // Retrieve the initial likes count from Firestore
        const getLikesCount = async () => {
            const postRef = db.collection("Posts").doc(id);
            const postDoc = await postRef.get();
            if (postDoc.exists) {
                setLikesCount(postDoc.data().likesCount || 0);
            }
        };
        getLikesCount();
    }, [id]);

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
            setIsCommenting(false);
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

    return (
        <div className='post'>
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

            <div className="post_middle">
                {isEditing ? (
                    <Modal className="modal" isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
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

                        <div className="modalBtns">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </Modal>
                ) : (
                    <div>
                        <p style={{ fontSize: image ? '15px' : '30px' }}>{editedMessage}</p>
                        {image && <img src={editedImage} />}
                    </div>
                )}

                <div className="post_ReactInfo">
                    {likesCount >= 1 && <p>{likesCount} {liked ? 'Liked' : 'Like'}</p>}
                    {comments.length >= 1 && <p onClick={openCommentModal}>{comments.length} Comments</p>}

                    <Modal
                        className="post_commentModal"
                        isOpen={isCommentModalOpen}
                        onRequestClose={closeCommentModal}
                        contentLabel='Comments'
                    >
                        <button onClick={closeCommentModal}>Close</button>

                        <h2>Comments</h2>
                        <div className='post_comments'>
                            {comments.map((comment) => (
                                <div key={comment.id} className='post_comment'>
                                    <Avatar src={comment.photoURL} /> {/* Use comment.photoURL */}
                                    <div className='post_commentInfo'>
                                        <p className='post_commentInfo_User'>{comment.displayName}</p> {/* Use comment.displayName */}
                                        <p className='post_commentInfo_Comment'>{comment.text}</p>
                                        <p className='post_commentInfo_Timestamp'>
                                            {timeAgo(comment.timestamp)}
                                        </p>
                                        <button onClick={() => deleteComment(comment.id)}>Delete Comment</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                        {isCommenting && (
                            <div className='post_commentInput'>
                                <input
                                    type='text'
                                    placeholder='Write a comment...'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button onClick={postComment}>Post</button>
                            </div>
                        )}
                    </Modal>

                    <Modal
                        className="post_shareModal"
                        isOpen={isShareDialogOpen}
                        onRequestClose={closeShareDialog}
                        contentLabel='Share Post'
                    >
                        <h2>Share Post</h2>
                        <p>Share this post with others:</p>
                        {/* Add a field to display the post URL here */}
                        <button onClick={closeShareDialog}>Close</button>
                    </Modal>
                </div>
            </div>

            <div className="post_bottom">
                <div className='post_bottomOption' onClick={handleLike}>
                    <ThumbUpAltOutlinedIcon style={{ color: liked ? 'blue' : 'gray' }} />
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