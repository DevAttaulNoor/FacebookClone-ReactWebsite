import '../../CSS/HomePage/HomePage_Feeds_Posts_EditModal.css';
import React, { useState, useRef } from 'react';
import { db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';

function HomePage_Feeds_Posts_EditModal({id, image, video, message, save, close}){
    const [{ user }] = useStateValue();
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [editedImage, setEditedImage] = useState(image);
    const [editedVideo, setEditedVideo] = useState(video);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const videoFileRef = useRef(null);

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
                <button onClick={save.onSave}>Save</button>
                <button onClick={close.onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default HomePage_Feeds_Posts_EditModal