import React from 'react'
import "../CSS/Posts.css"
import { Avatar } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ShareIcon from '@mui/icons-material/Share';

function Posts({photoURL, image, username, timestamp, message}) {
  return (
    <div className='post'>
        <div className="post_top">
            <div className="post_topleft">
                <Avatar src={photoURL}/>
                <div className="postinfo">
                    <h4>{username}</h4>
                    <p>{timestamp} <PublicIcon/></p>
                </div>
            </div>
            <MoreHorizIcon/>
        </div>

        <div className="post_middle">
            <p>{message}</p>
            {image && <img src={image}/>}
            {/* <img src="" alt="" /> */}
        </div>

        <div className="post_bottom">
            <div className='post_bottomOption'>
                <ThumbUpIcon/>
                <p>Like</p>
            </div>
            <div className='post_bottomOption'>
                <ModeCommentIcon/>
                <p>Comment</p>
            </div>
            <div className='post_bottomOption'>
                <ShareIcon/>
                <p>Share</p>
            </div>
        </div>
    </div>
  )
}

export default Posts