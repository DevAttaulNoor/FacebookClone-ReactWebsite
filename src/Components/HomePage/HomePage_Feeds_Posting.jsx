import "../../CSS/HomePage/HomePage_Feeds_Posting.css";
import React, { useState, useRef, useEffect } from 'react';
import { useStateValue } from "../BackendRelated/StateProvider";
import { db, storage } from "../BackendRelated/Firebase";
import { Avatar, IconButton, Modal } from '@mui/material';
import firebase from "firebase/compat/app";
import CloseIcon from '@mui/icons-material/Close';
import EmojiPicker from 'emoji-picker-react';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import bgcolorIcon from '../../Imgs/Aa.png'

function HomePage_Feeds_Posting() {
    const [{ user }] = useStateValue();
    const [open, setOpen] = useState(false);
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);

    const handleClose = () => {
        setOpen(false)
        setMessage("")
        setMedia("")
        setProgress(0)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const uploadWithClick = () => {
        document.getElementById("mediaFile").click()
    }

    const handleMediaChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setMedia(file);

            // Determine the media type (image or video)
            if (file.type.startsWith("image/")) {
                setMediaType("image");
            } else if (file.type.startsWith("video/")) {
                setMediaType("video");
            }
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (message === "" && media === null) {
            return;
        }

        if (media === null) {
            // Handle text-only posts in Firestore
            db.collection("Posts").add({
                uid: user.uid,
                email: user.email,
                username: user.username,
                photoURL: user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: message,
            });
            handleClose();
        }

        else {
            // Handle image upload to Firebase Storage
            if (mediaType === "image") {
                const uploadTask = storage.ref(`Images/Posts/${user.uid}/${media.name}`).put(media);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage.ref(`Images/Posts/${user.uid}`).child(media.name).getDownloadURL().then(url => {
                            db.collection("Posts").add({
                                uid: user.uid,
                                email: user.email,
                                username: user.username,
                                photoURL: user.photoURL,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                message: message,
                                image: url // Store the image URL in Firestore
                            });
                            handleClose();
                        });
                    }
                );
            } 
            
            else if (mediaType === "video") {
                // Handle video upload to Firebase Storage
                const uploadTask = storage.ref(`Videos/Posts/${user.uid}/${media.name}`).put(media);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage.ref(`Videos/Posts/${user.uid}`).child(media.name).getDownloadURL().then(url => {
                            db.collection("Posts").add({
                                uid: user.uid,
                                email: user.email,
                                username: user.username,
                                photoURL: user.photoURL,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                message: message,
                                video: url // Store the video URL in Firestore
                            });
                            handleClose();
                        });
                    }
                );
            }
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker); // Toggle the state to show/hide the emoji picker
    };

    const handleEmojiClick = (event) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
    };

    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(e.target)) {
                setIsDialogVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className='homepage_feedsPosting'>
            <div className="homepage_feedsPosting_top">
                <Avatar src={user.photoURL} />
                <input type="text" placeholder={`What's on your mind ${user.username}?`} onClick={handleOpen} />
            </div>

            <div className="homepage_feedsPosting_bottom">
                <div className="homepage_feedsPosting_bottomOption">
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                    <p>Live video</p>
                </div>
                <div className="homepage_feedsPosting_bottomOption" onClick={handleOpen}>
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                    <p>Photo/video</p>
                </div>
                <div className="homepage_feedsPosting_bottomOption">
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                    <p>Feeling/activity</p>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <div className="postingModal">
                    <form action="">
                        <div className="postingModal_Top">
                            <p>Create Post</p>
                            <CloseIcon onClick={handleClose} />
                        </div>

                        <div className="postingModal_Middle">
                            <div className="postingModal_MiddleTop">
                                <Avatar src={user.photoURL} />
                                <p>{user.username}</p>
                            </div>
                            <div className="postingModal_MiddleMiddle">
                                <textarea cols="5" placeholder="What's on your mind" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                            </div>
                            <div className="postingModal_MiddleBottom">
                                <img src={bgcolorIcon} alt="" />
                                <SentimentSatisfiedAltOutlinedIcon onClick={toggleDialog} ref={dialogBoxRef} />
                                {isDialogVisible && (
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                )}
                            </div>

                            <input type="file" id="mediaFile" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: 'none' }} />
                        </div>

                        <div className="postingModal_Bottom">
                            <div className="postingModal_BottomLeft">
                                <p>Add to your post</p>
                            </div>
                            <div className="postingModal_BottomRight">
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" onClick={uploadWithClick} />
                                </IconButton>
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                                </IconButton>
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                                </IconButton>
                            </div>
                        </div>
                        {media !== "" && <personalbar className='image_progress'>Media is added</personalbar>}
                        {progress != "" && <progress className='post_progress' value={progress} max="100" />}
                        <button type="submit" id="submitBtn" onClick={handleUpload}>Post</button>
                    </form>
                </div>
            </Modal >
        </div >
    )
}

export default HomePage_Feeds_Posting