import '../../CSS/HomePage/HomePage_Feeds_Posts_LikeModal.css';
import React, { useState, useEffect } from 'react';
import { useStateValue } from '../BackendRelated/StateProvider';
import { db } from '../BackendRelated/Firebase';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function HomePage_Feeds_Posts_LikeModal({ id, closeModal }) {
    const [{ user }] = useStateValue();
    const [likedUsers, setLikedUsers] = useState([]);
    const [currentUserLiked, setCurrentUserLiked] = useState(false);

    useEffect(() => {
        const likedUsersRef = db.collection("Posts").doc(id).collection("likes");

        // Add a snapshot listener to listen for changes in the "likes" subcollection
        const unsubscribe = likedUsersRef.onSnapshot((querySnapshot) => {
            const likedUsersData = [];
            querySnapshot.forEach((doc) => {
                likedUsersData.push(doc.data());
            });
            setLikedUsers(likedUsersData);

            // Check if the current user has liked the post and set a flag accordingly
            const currentUserLiked = likedUsersData.some((likedUser) => likedUser.uid === user.uid);
            setCurrentUserLiked(currentUserLiked);
        });

        return () => {
            unsubscribe();
        };
    }, [id, user.uid]);

    return (
        <div className='HomePageFeedsPosts_LikeModal'>
            <div className="HomePageFeedsPosts_LikeModal_Top">
                <CloseIcon onClick={closeModal.closeLikeModal} />
                <p>Reactions</p>
            </div>

            <hr />

            <div className="HomePageFeedsPosts_LikeModal_Middle">
                {likedUsers.map((user) => (
                    <div key={user.uid} className='likedUsersInfo'>
                        <Avatar src={user.photoUrl} />
                        <span>{user.username}</span>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default HomePage_Feeds_Posts_LikeModal