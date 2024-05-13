import '../../CSS/HomePage/HomePageFeedPostEdit.css';
import bgcolorIcon from '../../Assets/Images/Aa.png'
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, IconButton } from '@mui/material';
import { db, storage } from '../../Firebase/firebase';
import EmojiPicker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';

function HomePageFeedPostEdit({ id, media, mediaType, message, close }) {
    const user = useSelector((state) => state.data.user.user);
    const [mediaContent, setMediaContent] = useState(media);
    const [mediaContentUrl, setMediaContentUrl] = useState('');
    const [messageContent, setMessageContent] = useState(message);
    const [mediaTypeContent, setMediaTypeContent] = useState(mediaType);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiBoxRef = useRef(null);
    const mediaInputRef = useRef(null);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event) => {
        setMessageContent((prevMessage) => prevMessage + event.emoji);
    };

    const handleMediaRemoval = () => {
        setMediaContent('');
        setMediaContentUrl('')
        setMediaTypeContent('');
    }

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaContent(file);
            const mediaURL = URL.createObjectURL(file);
            setMediaContentUrl(mediaURL);

            // Determine the media type (image or video)
            if (file.type.startsWith("image/")) {
                setMediaTypeContent("image");
            } else if (file.type.startsWith("video/")) {
                setMediaTypeContent("video");
            }
        }
    };

    // const handleSave = async () => {
    //     const postRef = db.collection("Posts").doc(id);
    //     const updateData = {};

    //     if (messageContent !== message) {
    //         updateData.message = messageContent;
    //     }
        
    //     if ((mediaContent !== '') && (mediaContent !== media)) {
    //         const StorageRef = storage.ref(`Posts/${user.uid}/${mediaContent.name}`);
    //         await StorageRef.put(mediaContent);
    //         const mediaUrl = await StorageRef.getDownloadURL();
    //         updateData.media = mediaUrl;
    //         updateData.mediaType = mediaTypeContent;
    //     }

    //     else if ((messageContent !== message) && (mediaContent !== media) && (mediaContent !== '')) {
    //         const StorageRef = storage.ref(`Posts/${user.uid}/${mediaContent.name}`);
    //         await StorageRef.put(mediaContent);
    //         const mediaUrl = await StorageRef.getDownloadURL();
    //         updateData.media = mediaUrl;
    //         updateData.mediaType = mediaTypeContent;
    //         updateData.message = messageContent;
    //     }

    //     if (Object.keys(updateData).length > 0) {
    //         try {
    //             await postRef.update(updateData);
    //             console.log("Post Edited Sucessfully");
    //             // setCloseEditBox(close);
    //         }

    //         catch (error) {
    //             console.error("Error editing post: ", error);
    //         }
    //     }
    // };

    const handleSave = async () => {
        const postRef = db.collection("Posts").doc(id);
        const updateData = {};
    
        if (messageContent !== message) {
            updateData.message = messageContent;
        }
        
        if (mediaContent !== '' && mediaContent !== media) {
            const StorageRef = storage.ref(`Posts/${user.uid}/${mediaContent.name}`);
            await StorageRef.put(mediaContent);
            const mediaUrl = await StorageRef.getDownloadURL();
            updateData.media = mediaUrl;
            updateData.mediaType = mediaTypeContent;
        } else if (mediaContent === '') {
            // Set media to null if mediaContent is empty
            updateData.media = null;
        }
    
        if (Object.keys(updateData).length > 0) {
            try {
                await postRef.update(updateData);
                console.log("Post Edited Successfully");
                // setCloseEditBox(close);
            } catch (error) {
                console.error("Error editing post: ", error);
            }
        }
    };

    return (
        <div className="postingModal">
            <div className="postingModal_Top">
                <p>Edit Post</p>
                <CloseIcon onClick={close} />
            </div>

            <div className="postingModal_Middle">
                <div className="postingModal_MiddleTop">
                    <Avatar src={user.photoURL} />
                    <p>{user.username}</p>
                </div>

                <div className="postingModal_MiddleMiddle">
                    {mediaContent ? (
                        <>
                            <textarea
                                id='mediaMsg'
                                rows="4"
                                value={messageContent}
                                placeholder="What's on your mind"
                                onChange={(e) => setMessageContent(e.target.value)}
                            />

                            <SentimentSatisfiedAltOutlinedIcon onClick={toggleEmojiPicker} ref={emojiBoxRef} />
                            {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                        </>
                    ) : (
                        <textarea
                            id='nonmediaMsg'
                            rows="4"
                            value={messageContent}
                            placeholder="What's on your mind"
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                    )}
                </div>

                <div className="postingModal_MiddleBottom">
                    {mediaContent ? (
                        <div className='mediaContainer'>
                            {mediaTypeContent === 'image' && (
                                <>
                                    {mediaContent === media ? (
                                        <img id="originalImg" src={mediaContent} alt="Original" />

                                    ) : (
                                        <img id="originalImg" src={mediaContentUrl} alt="Original" />
                                    )}
                                </>
                            )}

                            {mediaTypeContent === 'video' && (
                                <>
                                    {mediaContent === media ? (
                                        <video id="originalVideo" controls>
                                            <source src={mediaContent} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <video id="originalVideo" controls>
                                            <source src={mediaContentUrl} type="video/mp4" />
                                        </video>
                                    )}
                                </>
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

            <div className="postingModal_Bottom">
                <div className="postingModal_BottomLeft">
                    <p>Add to your post</p>
                </div>
                <div className="postingModal_BottomRight">
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

            {messageContent || mediaContent ? (
                <button id="submitBtn" onClick={handleSave}>Save</button>
            ) : (
                <button id="notSubmitBtn">Save</button>
            )}
        </div>
    )
}

export default HomePageFeedPostEdit