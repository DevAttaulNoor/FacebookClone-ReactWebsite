import '../../CSS/HomePage/HomePage_Feeds_Posts_LikeModal.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function HomePage_Feeds_Posts_LikeModal({ id, closeModal }) {
    const user = useSelector((state) => state.data.user.user);
    const [likedUsers, setLikedUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("Posts").doc(id).collection("likes").onSnapshot((querySnapshot) => {
            const likedUsersData = [];
            querySnapshot.forEach((doc) => {
                likedUsersData.push(doc.data());
            });
            setLikedUsers(likedUsersData);
        });

        return () => {
            unsubscribe();
        };
    }, [id, user.uid]);

    return (
        <div className='HomePageFeedsPosts_LikeModal'>
            <div className="HomePageFeedsPosts_LikeModal_Top">
                <p>Reactions</p>
                <CloseIcon onClick={closeModal.closeLikeModal} />
            </div>

            <div className="HomePageFeedsPosts_LikeModal_Middle">
                {likedUsers.map((user) => (
                    <div key={user.uid} className='likedUsersInfo'>
                        <Avatar src={user.photoUrl} />
                        <span>{user.username}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage_Feeds_Posts_LikeModal