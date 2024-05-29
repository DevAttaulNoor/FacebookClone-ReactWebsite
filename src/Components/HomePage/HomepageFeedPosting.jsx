import "../../CSS/HomePage/HomepageFeedPosting.css";
import bgcolorIcon from '../../Assets/Images/Aa.png'
import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import { Avatar, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';

function HomepageFeedPosting() {
    const user = useSelector((state) => state.data.user.user);
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiBoxRef = useRef(null);
    const mediaInputRef = useRef(null);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (e) => {
        setMessage((prevMessage) => prevMessage + e.emoji);
    };

    const handlePhotoOptionClick = () => {
        setOpenModal(true);
        if (mediaInputRef.current) {
            mediaInputRef.current.click();
        }
    }

    const handleModalClose = () => {
        setOpenModal(false);
        setMessage('');
        setMedia('');
        setMediaUrl('');
    }

    const handleMediaRemoval = () => {
        setMedia('');
        setMediaUrl('')
        setMediaType('');
    }

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            const mediaURL = URL.createObjectURL(file);
            setMediaUrl(mediaURL);

            // Determine the media type (image or video)
            if (file.type.startsWith("image/")) {
                setMediaType("image");
            } else if (file.type.startsWith("video/")) {
                setMediaType("video");
            }
        }
    };

    const handlePosting = async (e) => {
        e.preventDefault();
        setPostLoading(true);

        const postDetails = {
            uid: user.uid,
            email: user.email,
            username: user.username,
            photoURL: user.photoURL,
            timestamp: Math.floor(new Date().getTime() / 1000),
        };

        try {
            if ((message !== '') && (media === '')) {
                await db.collection("Posts").add({
                    ...postDetails,
                    message: message,
                });
                setPostLoading(false);
                handleModalClose();
                return;
            }

            if ((message === '') && (media !== '')) {
                const storageRef = storage.ref(`Posts/${user.uid}/${media.name}`);
                await storageRef.put(media);
                const mediaUrl = await storageRef.getDownloadURL();

                await db.collection("Posts").add({
                    ...postDetails,
                    media: mediaUrl,
                    mediaType: mediaType,
                });

                setPostLoading(false);
                handleModalClose();
            }

            if ((message !== '') && (media !== '')) {
                const storageRef = storage.ref(`Posts/${user.uid}/${media.name}`);
                await storageRef.put(media);
                const mediaUrl = await storageRef.getDownloadURL();

                await db.collection("Posts").add({
                    ...postDetails,
                    message: message,
                    media: mediaUrl,
                    mediaType: mediaType,
                });

                setPostLoading(false);
                handleModalClose();
            }
        } catch (error) {
            console.error("Error uploading post: ", error);
            setPostLoading(false);
        }
    };

    return (
        <div className='homepageFeedPosting'>
            <div className="homepageFeedPostingTop">
                <Avatar src={user.photoURL} />
                <div className="inputContainer" onClick={() => setOpenModal(true)}>
                    <p>{`What's on your mind, ${user.username}?`}</p>
                </div>
            </div>

            <div className="homepageFeedPostingBottom">
                <div className="homepageFeedPostingBottomOption" onClick={() => setOpenModal(true)}>
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                    <p>Live video</p>
                </div>
                <div className="homepageFeedPostingBottomOption" onClick={handlePhotoOptionClick}>
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                    <p>Photo/video</p>
                </div>
                <div className="homepageFeedPostingBottomOption" onClick={() => setOpenModal(true)}>
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                    <p>Feeling/activity</p>
                </div>
            </div>

            <Modal open={openModal} onClose={handleModalClose}>
                <div className="postingModal">
                    <div className="postingModalTop">
                        <p>Create Post</p>
                        <CloseIcon onClick={handleModalClose} />
                    </div>

                    <div className="postingModalMiddle">
                        <div className="postingModalMiddleTop">
                            <Avatar src={user.photoURL} />
                            <p>{user.username}</p>
                        </div>

                        <div className="postingModalMiddleMiddle">
                            {media ? (
                                <>
                                    <textarea
                                        id='mediaMsg'
                                        rows="4"
                                        value={message}
                                        placeholder="What's on your mind"
                                        onChange={(e) => setMessage(e.target.value)}
                                    />

                                    <SentimentSatisfiedAltOutlinedIcon onClick={toggleEmojiPicker} ref={emojiBoxRef} />
                                    {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                                </>
                            ) : (
                                <textarea
                                    id='nonmediaMsg'
                                    rows="4"
                                    value={message}
                                    placeholder="What's on your mind"
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="postingModalMiddleBottom">
                            {media ? (
                                <div className='mediaContainer'>
                                    {mediaType === 'image' && (
                                        <img id="mediaImg" src={mediaUrl} alt="postingImg" />
                                    )}

                                    {mediaType === 'video' && (
                                        <video id="mediaVideo" controls>
                                            <source src={mediaUrl} type="video/mp4" />
                                        </video>
                                    )}
                                    <CloseIcon id='closeIcon' onClick={handleMediaRemoval} />
                                </div>
                            ) : (
                                <>
                                    <img src={bgcolorIcon} alt="" />
                                    <SentimentSatisfiedAltOutlinedIcon onClick={toggleEmojiPicker} ref={emojiBoxRef} />
                                    {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="postingModalBottom">
                        <div className="postingModalBottomTop">
                            <p>Add to your post</p>

                            <div className="postingModalBottomOptions">
                                <IconButton onClick={() => mediaInputRef.current.click()}>
                                    <img src="https:static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleMediaChange}
                                        style={{ display: 'none' }}
                                        ref={mediaInputRef}
                                    />
                                </IconButton>

                                <IconButton>
                                    <img src="https:static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                                </IconButton>

                                <IconButton>
                                    <img src="https:static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                                </IconButton>
                            </div>
                        </div>

                        <div className="postingModalBottomBottom">
                            {message || media ? (
                                <button id="submitBtn" onClick={handlePosting}>{postLoading ? <div className="loadingSpin"></div> : 'Post'}</button>
                            ) : (
                                <button id="notSubmitBtn">Post</button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    )
}

export default HomepageFeedPosting;