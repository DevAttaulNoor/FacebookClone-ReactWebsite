import '../../CSS/HomePage/HomepageFeedPostsLikeModal.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function HomepageFeedPostsLikeModal({ id, closeModal }) {
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
        <div className='homepageFeedPosts_LikeModal'>
            <div className="homepageFeedPosts_LikeModalTop">
                <p>Reactions</p>
                <CloseIcon onClick={closeModal.closeLikeModal} />
            </div>

            <div className="homepageFeedPosts_LikeModalMiddle">
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

export default HomepageFeedPostsLikeModal;