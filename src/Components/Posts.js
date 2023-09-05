import "../CSS/Posts.css"
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Avatar } from '@mui/material'
import { db, storage } from './Firebase'
import { useStateValue } from './StateProvider';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';

function Posts({ id, photoURL, image, username, timestamp, message }) {
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

    Modal.setAppElement('#root');

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!editedMessage && editedImage === undefined) {
            alert("Post cannot be empty!");
            return;
        }

        // Create an object to update in Firestore
        const updatedData = {
            message: editedMessage,
            // Check if there's a new editedImage; if not, keep the original image
            image: editedImage !== undefined ? editedImage : null,
        };

        // If there's a new editedImage, upload it to Firestore Storage
        if (editedImage !== null && editedImage !== undefined) {
            // Generate a unique filename (e.g., using a timestamp)
            const timestamp = new Date().getTime();
            const editedFileName = `edited_image_${timestamp}.jpg`; // Set the file type to JPEG

            // Reference to the Firebase Storage bucket
            const storageRef = storage.ref();

            // Reference to the specific edited image file
            const editedImageRef = storageRef.child(`Images/${editedFileName}`);

            // Upload the edited image file with content type
            editedImageRef.put(editedImage, { contentType: "image/jpeg" }) // Specify content type as image/jpeg
                .then((snapshot) => {
                    // Image successfully uploaded, now get the download URL
                    console.log(snapshot.ref.getDownloadURL())
                    return snapshot.ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    // Add the download URL to the updatedData object
                    updatedData.image = downloadURL;

                    // Update the Firestore document with the edited data
                    db.collection("Posts")
                        .doc(id)
                        .update(updatedData)
                        .then(() => {
                            console.log("Document successfully updated!");
                            setIsEditing(false);
                            setIsDropdownVisible(false);
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error uploading edited image: ", error);
                });
        } else {
            // No new image to upload, update the Firestore document with the edited data directly
            db.collection("Posts")
                .doc(id)
                .update(updatedData)
                .then(() => {
                    console.log("Document successfully updated!");
                    setIsEditing(false);
                    setIsDropdownVisible(false);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }
    };

    const handleDelete = () => {
        // Reference to the post's comments collection
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
        const file = e.target.files[0]; // Get the selected image file

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedImage(reader.result); // Set the selected image as editedImage
            };
            reader.readAsDataURL(file); // Read the image file and convert it to data URL
        } else {
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
        // Toggle the like state
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

    const postComment = () => {
        if (comment.trim() === '') {
            return;
        }

        // Create a new comment object
        const newComment = {
            text: comment,
            timestamp: new Date(),
            // You can also store the commenter's username and photoURL here
        };

        // Update comments in Firestore
        db.collection("Posts").doc(id).collection("comments").add(newComment);

        // Clear the comment input field
        setComment('');

        // Close the comment input field
        setIsCommenting(false);
    };

    useEffect(() => {
        // Function to retrieve and listen to comments in real-time
        const getRealtimeComments = () => {
            const commentsRef = db.collection("Posts").doc(id).collection("comments");

            // Set up a real-time listener for new comments and changes
            return commentsRef.orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
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
    }, [id]); // Make sure to include 'id' in the dependency array

    const deleteComment = (commentId) => {
        db.collection("Posts")
            .doc(id)
            .collection("comments")
            .doc(commentId)
            .delete()
            .then(() => {
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

                        <div className="file-input-container">
                            <label htmlFor="file-input" className="file-input-label">
                                Select Image
                            </label>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                className="file-input"
                                onChange={handleImageUpload}
                            />
                            <span className="file-name">{editedImage ? editedImage.name : "No file selected"}</span>
                        </div>
                        <div className="modalBtns">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </Modal>
                ) : (
                    <div>
                        <p>{editedMessage}</p>
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
                                    <Avatar src={user.photoURL} />
                                    <div className='post_commentInfo'>
                                        <p className='post_commentInfo_User'>{user.displayName}</p>
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