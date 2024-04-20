import '../../CSS/HomePage/HomepageFeedPostsShareModal.css';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

function HomepageFeedPostsShareModal(close) {
    return (
        <div className='HomePageFeedsPosts_ShareModal'>
            <div className="HomePageFeedsPosts_ShareModal_Top">
                <p>Shares</p>
                <CloseIcon onClick={close.closeModal} />
            </div>
        </div>
    )
}

export default HomepageFeedPostsShareModal;