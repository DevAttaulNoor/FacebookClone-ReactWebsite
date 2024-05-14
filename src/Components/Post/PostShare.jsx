import '../../CSS/Post/PostShare.css';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

function PostShare(close) {
    return (
        <div className='postShare'>
            <div className="postShareTop">
                <p>Shares</p>
                <CloseIcon onClick={close.closeModal} />
            </div>
        </div>
    )
}

export default PostShare;