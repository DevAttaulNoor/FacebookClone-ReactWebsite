import '../../CSS/HomePage/HomePage_Feeds_Posts_ShareModal.css';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

function HomePage_Feeds_Posts_ShareModal(close) {
    return (
        <div className='HomePageFeedsPosts_ShareModal'>
            <div className="HomePageFeedsPosts_ShareModal_Top">
                <CloseIcon onClick={close.closeModal} />
                <p>Shares</p>
            </div>

            <hr />
        </div>
    )
}

export default HomePage_Feeds_Posts_ShareModal