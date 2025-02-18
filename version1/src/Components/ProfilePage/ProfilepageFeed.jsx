import '../../CSS/ProfilePage/ProfilepageFeed.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { timeAgo, formatJoinedDate } from "../../Assets/Utility/TimeModule";
import Post from '../PostPage/PostFeed';

function ProfilepageFeed() {
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const [posts, setPosts] = useState([]);
    const [joinedposts, setJoinedPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("Posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const filteredPosts = snapshot.docs
                    .filter(doc => doc.data().uid === selectedFriend) // Filter posts by userUid
                    .filter(doc => !doc.data().dob) // Filter out posts with a "dob" attribute
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setPosts(filteredPosts);
            });
        return () => unsubscribe();
    }, [selectedFriend]);

    useEffect(() => {
        const unsubscribeJoined = db.collection("Posts")
            .onSnapshot(snapshot => {
                const filteredJoinedPosts = snapshot.docs
                    .filter(doc => doc.data().uid === selectedFriend) // Filter posts by userUid
                    .filter(doc => doc.data().dob) // Filter out posts with a "dob" attribute
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setJoinedPosts(filteredJoinedPosts);
            });
        return () => unsubscribeJoined();
    }, [selectedFriend]);

    return (
        <div className='profilePageFeed'>
            {posts.map(post => {
                const formattedDate = timeAgo(post.data.timestamp);
                return (
                    <Post
                        id={post.id}
                        userid={post.data.uid}
                        photoURL={post.data.photoURL}
                        media={post.data.media}
                        mediaType={post.data.mediaType}
                        username={post.data.username}
                        timestamp={formattedDate}
                        message={post.data.message}
                        key={post.id}
                    />
                );
            })}

            {joinedposts.map(joinedpost => {
                const dob = joinedpost.data.dob;
                return (
                    <div className="JoinedPost" key={joinedpost.id}>
                        <Post
                            id={joinedpost.id}
                            userid={joinedpost.data.uid}
                            photoURL={joinedpost.data.photoURL}
                            image={joinedpost.data.image}
                            username={joinedpost.data.username}
                            timestamp={formatJoinedDate(dob)}
                            message={
                                <div className='JoinedPostMsg'>
                                    <img id='joinedImg' src='https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/1SViyXWaRzP.png' alt="joinedImage" />
                                    <p id='joinedMsg'>{`Born on ${formatJoinedDate(dob)}`}</p>
                                </div>
                            }
                            key={joinedpost.id}
                        />
                    </div>
                );
            })}
        </div>
    )
}

export default ProfilepageFeed;