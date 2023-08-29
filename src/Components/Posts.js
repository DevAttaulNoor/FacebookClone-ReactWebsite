import React from 'react'
import "../CSS/Posts.css"
import { Avatar } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';

function Posts({ photoURL, image, username, timestamp, message }) {
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
                <MoreHorizIcon />
            </div>

            <div className="post_middle">
                {/* <p style={{ fontSize: image === "" ? "25px" : "15px" }}>
                    {message}
                </p> */}

                { image === "" && <p style={{fontSize: "25px"}}>{message}</p>}
                <p>{message}</p>
                {image && <img src={image} />}
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