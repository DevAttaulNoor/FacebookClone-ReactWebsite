import '../../CSS/HomePage/HomePage_Feeds_Posts_EditModal.css';
import React, { useState, useRef } from 'react';
import { db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';

function HomePage_Feeds_Posts_EditModal({id, image, video, message, onSave }){
    const [{ user }] = useStateValue();
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [editedVideo, setEditedVideo] = useState(video);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const videoFileRef = useRef(null);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedMessage(message); // Set the edited message
        setEditedImage(image);     // Set the edited image
        setEditedVideo(video);     // Set the edited video URL
    };

    const handleSave = () => {
        if (editedVideo !== video && editedVideo !== null) {
            // If there is a new video, upload it to Firebase Storage and update Firestore
            const videoFile = videoFileRef.current;
            if (videoFile) {
                const uploadTask = storage.ref(`Videos/Posts/${user.uid}/${videoFile.name}`).put(videoFile);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    },
                    (error) => {
                        console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage
                            .ref(`Videos/Posts/${user.uid}`)
                            .child(videoFile.name)
                            .getDownloadURL()
                            .then((url) => {
                                const updatedData = {
                                    message: editedMessage,
                                    video: url, // Store the video URL in Firestore
                                };
                                // Update the Firestore document with the edited data, including the video URL
                                return db.collection("Posts").doc(id).update(updatedData);
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                setIsEditing(false);
                                setIsDropdownVisible(false);
                                onSave(); // Call the onSave function from props
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                            });
                    }
                );
            }
        } else {
            // Handle cases when there is no new video, or no changes were made
            if (editedMessage !== message) {
                db.collection("Posts")
                    .doc(id)
                    .update({
                        message: editedMessage,
                    })
                    .then(() => {
                        console.log("Document successfully updated!");
                        setIsEditing(false);
                        setIsDropdownVisible(false);
                        onSave(); // Call the onSave function from props
                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            } else {
                // No changes were made, so simply close the editing form
                setIsEditing(false);
                setIsDropdownVisible(false);
                onSave(); // Call the onSave function from props
            }
        }
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const storageRef = storage.ref(`Media/Posts/${user.uid}/${file.name}`);
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

                    db.collection("Posts").doc(id).update({
                        image: file.type.startsWith("image/") ? url : editedImage,
                        video: file.type.startsWith("video/") ? url : editedVideo
                    })
                        .then(() => {
                            console.log("Media URL in Firestore updated successfully!");
                        })
                        .catch((error) => {
                            console.error("Error updating media URL in Firestore: ", error);
                        });
                });
            });
        } 
        
        else {
            // If no file is selected (e.g., user canceled the upload), reset editedImage and editedVideo to null
            setEditedImage(null);
            setEditedVideo(null);
        }
    };

    return (
        <div className='HomePageFeedsPosts_EditModal'>
            <div className="HomePageFeedsPosts_EditModal_Top">
                <h2>Edit Post</h2>
            </div>

            <div className="HomePageFeedsPosts_EditModal_Middle">
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

            <div className="HomePageFeedsPosts_EditModal_Bottom">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        </div>
    )
}

export default HomePage_Feeds_Posts_EditModal