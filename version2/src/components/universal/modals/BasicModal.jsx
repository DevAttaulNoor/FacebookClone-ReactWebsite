import { ModalLayout } from "@layouts/ModalLayout"

export const BasicModal = ({ isOpen, onClose }) => {
    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
        >
            {/* <div className="postingModal">
                <div className="postingModalTop">
                    <p>Create Post</p>
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
            </div> */}
        </ModalLayout>
    )
}