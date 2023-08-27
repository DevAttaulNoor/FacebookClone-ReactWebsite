import { Avatar, IconButton, Modal } from '@mui/material'
import React, { useState } from 'react'
import "../CSS/MessageSender.css"
import CloseIcon from '@mui/icons-material/Close';
import { useStateValue } from './StateProvider';
import firebase from 'firebase/app';
import { db, storage } from './Firebase';

function MessageSender() {
    const [{ user }, dispatch] = useStateValue();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("")
    const [message, setMessage] = useState("")
    const [progress, setProgress] = useState(0);

    const handleClose = () => {
        setOpen(false)
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
        if (image === "") {
            db.collection("Posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: message,
                username: user.displayName,
                photoURL: user.photoURL
            });
            handleClose();
            setMessage("");
        }

        else {
            const uploadTask = storage.ref(`Images/${image.name}`).put(image);

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
                    storage.ref("Images").child(image.name).getDownloadURL().then(url => {
                        db.collection("Posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            message: message,
                            username: user.displayName,
                            photoURL: user.photoURL,
                            image: url
                        });
                        handleClose();
                        setMessage("");
                        setImage("");
                        setProgress(0);
                    })
                }
            )
        }
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <div className="modal_pop">
                    <form action="">
                        <div className="modalHeading">
                            <h3>Create Post</h3>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className="modalHeader_top">
                            <Avatar src={user.photoURL} />
                            <h5>{user.displayName}</h5>
                        </div>

                        <div className="modalBody">
                            <textarea cols="5" placeholder="What's on your mind" onChange={e => setMessage(e.target.value)}>{message}</textarea>
                        </div>

                        <div className="modalFooter">
                            <div className="modalFooterLeft">
                                <h4>Add to your post</h4>
                            </div>
                            <div className="modalFooterRight">
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" onClick={uploadWithClick} />
                                </IconButton>

                                <input type="file" id='imageFile' onChange={handleChange} style={{ display: 'none' }} />

                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                                </IconButton>
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                                </IconButton>
                            </div>
                        </div>
                        {image !== "" && <h2 className='image_progress'>Image is added</h2>}
                        {progress != "" && <progress className='post_progress' value={progress} max="100" />}
                        <input type="submit" className='post_submit' onClick={handleUpload} value="Post" />
                    </form>
                </div>
            </Modal>

            <div className='messagesender'>
                <div className="messagesender_top">
                    <Avatar src={user.photoURL} />
                    <form action="">
                        <input type="text" placeholder={`What's on your mind ${user.displayName}`} onClick={handleOpen} />
                    </form>
                </div>

                <div className="messagesender_bottom">
                    <div className="messangerOption">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                        <p>Live Video</p>
                    </div>
                    <div className="messangerOption">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                        <p>Photo/Video</p>
                    </div>
                    <div className="messangerOption">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                        <p>Feeling/Activity</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageSender