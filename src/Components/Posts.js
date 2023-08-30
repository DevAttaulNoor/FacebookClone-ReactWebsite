import React, { useState } from 'react'
import "../CSS/Posts.css"
import { Avatar } from '@mui/material'
import { db } from './Firebase'
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import Modal from 'react-modal';


function Posts({ id, photoURL, image, username, timestamp, message }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // New state for dropdown
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);

    // Inside your Posts component
    Modal.setAppElement('#root'); // This is required to handle accessibility

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        db.collection("Posts").doc(id).update({
            message: editedMessage,
            image: editedImage
        })
            .then(() => {
                console.log("Document successfully updated!");
                setIsEditing(false);
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    };

    const handleDelete = () => {
        db.collection("Posts").doc(id).delete()
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch(error => {
                console.error("Error removing document: ", error);
            });
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
        setIsDropdownClicked(!isDropdownClicked);
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
                <div className={`post_topright ${isDropdownClicked ? 'clicked' : ''}`} onClick={toggleDropdown}>
                    <MoreHorizIcon />
                    {isDropdownVisible && (
                        <div className="dropdownMenu">
                            {/* Dropdown menu items go here */}
                            <button onClick={handleDelete}>Delete the post</button>
                            {isEditing ? (
                                <button onClick={handleSave}>Save the post</button>
                            ) : (
                                <button onClick={handleEdit}>Edit the post</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="post_middle">
                {isEditing ? (
                    <Modal
                        isOpen={isEditing}
                        onRequestClose={() => setIsEditing(false)}
                        contentLabel="Edit Post"
                        className="modal"
                    >
                        <h2>Edit Post</h2>
                        <input
                            type="text"
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                        />
                        <input
                            type="text"
                            value={editedImage}
                            onChange={(e) => setEditedImage(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </Modal>
                ) : (
                    <div>
                        <p>{editedMessage}</p>
                        <img src={editedImage} alt="Post" />
                    </div>
                )}
            </div>

            <div className="post_bottom">
                <div className='post_bottomOption'>
                    <ThumbUpAltOutlinedIcon />
                    <p>Like</p>
                </div>
                <div className='post_bottomOption'>
                    <ChatBubbleOutlineOutlinedIcon />
                    <p>Comment</p>
                </div>
                <div className='post_bottomOption'>
                    <ReplyOutlinedIcon />
                    <p>Share</p>
                </div>
            </div>
        </div>
    )
}

export default Posts