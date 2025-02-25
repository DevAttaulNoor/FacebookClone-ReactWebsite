import '../../CSS/UserPage/UserpageFeed.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { timeAgo, formatJoinedDate } from '../../Assets/Utility/TimeModule';
import PostFeed from '../PostPage/PostFeed';
import HomepageFeedPosting from '../HomePage/HomepageFeedPosting';

function UserpageFeed() {
    const [posts, setPosts] = useState([]);
    const [joinedposts, setJoinedPosts] = useState([]);
    const userDataStr = sessionStorage.getItem('userData');
    const userData = JSON.parse(userDataStr);
    const userUid = userData.uid;

    useEffect(() => {
        const unsubscribe = db.collection("Posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const filteredPosts = snapshot.docs
                    .filter(doc => doc.data().uid === userUid) // Filter posts by userUid
                    .filter(doc => !doc.data().dob) // Filter out posts with a "dob" attribute
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setPosts(filteredPosts);
            });
        return () => unsubscribe();
    }, [userUid]);

    useEffect(() => {
        const unsubscribeJoined = db.collection("Posts")
            .onSnapshot(snapshot => {
                const filteredJoinedPosts = snapshot.docs
                    .filter(doc => doc.data().uid === userUid) // Filter posts by userUid
                    .filter(doc => doc.data().dob) // Filter out posts with a "dob" attribute
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setJoinedPosts(filteredJoinedPosts);
            });
        return () => unsubscribeJoined();
    }, [userUid]);

    return (
        <div className='userpageFeed'>
            <HomepageFeedPosting />
            {posts.map((post, index) => {
                return (
                    <div key={index}>
                        <PostFeed
                            id={post.id}
                            userid={post.data.uid}
                            photoURL={post.data.photoURL}
                            media={post.data.media}
                            mediaType={post.data.mediaType}
                            username={post.data.username}
                            timestamp={timeAgo(post.data.timestamp)}
                            message={post.data.message}
                        />
                    </div>
                );
            })}

            {joinedposts.map((joinedpost, index) => {
                return (
                    <div key={index} className="JoinedPost">
                        <PostFeed
                            id={joinedpost.id}
                            userid={joinedpost.data.uid}
                            photoURL={joinedpost.data.photoURL}
                            image={joinedpost.data.image}
                            username={joinedpost.data.username}
                            timestamp={formatJoinedDate(joinedpost.data.dob)}
                            message={
                                <div className='JoinedPostMsg'>
                                    <img id='joinedImg' src='https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/1SViyXWaRzP.png' alt="joinedPic" />
                                    <p id='joinedMsg'>{`Born on ${formatJoinedDate(joinedpost.data.dob)}`}</p>
                                </div>
                            }
                        />
                    </div>
                );
            })}
        </div>
    )
}

export default UserpageFeed;