import React, { useState, useEffect, useRef } from 'react';
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
    const dropdownRef = useRef(null);

    // Inside your Posts component
    Modal.setAppElement('#root'); // This is required to handle accessibility

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
            image: editedImage !== undefined ? editedImage : null, // Set to null if editedImage is undefined
        };
    
        db.collection("Posts").doc(id).update(updatedData)
            .then(() => {
                console.log("Document successfully updated!");
                setIsEditing(false);
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    }
    

    const handleDelete = () => {
        db.collection("Posts").doc(id).delete()
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch(error => {
                console.error("Error removing document: ", error);
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

    useEffect(() => {
        console.log('Editing:', isEditing);
        console.log('Edited Message:', editedMessage);
        console.log('Edited Image:', editedImage);
    }, [isEditing, editedMessage, editedImage]);

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
                    <Modal className="modal" isOpen={isEditing} onRequestClose={() => setIsEditing(false)} contentLabel="Edit Post">
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