import '../../CSS/HomePage/HomePage_Feeds_Posts_LikeModal.css';
import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function HomePage_Feeds_Posts_LikeModal({ id, closeModal }) {
    const [likedUsers, setLikedUsers] = useState([]);

    return (
        <div className='HomePageFeedsPosts_LikeModal'>
            <div className="HomePageFeedsPosts_LikeModalTop">
                <CloseIcon onClick={closeModal.closeLikeModal} />
                <p>Reactions</p>
            </div>

            <hr />

            <div className="HomePageFeedsPosts_LikeModalMiddle">
                {likedUsers.map((user) => (
                    <div key={user.uid}>
                        <Avatar src={user.photoUrl} />
                        <span>{user.username}</span>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default HomePage_Feeds_Posts_LikeModal