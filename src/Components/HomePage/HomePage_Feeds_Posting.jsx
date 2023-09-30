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
    const [{ user }, dispatch] = useStateValue();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);

    const handleClose = () => {
        setOpen(false)
        setMessage("")
        setImage("")
        setProgress(0)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const uploadWithClick = () => {
        document.getElementById("imageFile").click()
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = (e) => {
        e.preventDefault();
        if (message === "" && image === "") {
            return;
        }

        if (image === "") {
            db.collection("Posts").add({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: message,
            });
            handleClose();
        }

        else {
            const uploadTask = storage.ref(`Images/Posts/${user.uid}/${image.name}`).put(image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress)
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage.ref(`Images/Posts/${user.uid}`).child(image.name).getDownloadURL().then(url => {
                        db.collection("Posts").add({
                            uid: user.uid,
                            email: user.email,
                            username: user.displayName,
                            photoURL: user.photoURL,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: message,
                            image: url
                        });
                        handleClose();
                    })
                }
            )
        }
    }

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
                <input type="text" placeholder={`What's on your mind ${user.displayName}`} onClick={handleOpen} />
            </div>

            <div className="homepage_feedsPosting_bottom">
                <div className="homepage_feedsPosting_bottomOption">
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                    <p>Live Video</p>
                </div>
                <div className="homepage_feedsPosting_bottomOption" onClick={handleOpen}>
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                    <p>Photo/Video</p>
                </div>
                <div className="homepage_feedsPosting_bottomOption">
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                    <p>Feeling/Activity</p>
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
                                <p>{user.displayName}</p>
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

                            <input type="file" id='imageFile' onChange={handleChange} style={{ display: 'none' }} />
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
                        {image !== "" && <personalbar className='image_progress'>Image is added</personalbar>}
                        {progress != "" && <progress className='post_progress' value={progress} max="100" />}
                        <button type="submit" id="submitBtn" onClick={handleUpload}>Post</button>
                    </form>
                </div>
            </Modal >
        </div >
    )
}

export default HomePage_Feeds_Posting