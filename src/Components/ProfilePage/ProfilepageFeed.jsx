import '../../CSS/ProfilePage/ProfilepageFeed.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import Post from '../Post/Post';
import HomepageFeedPosting from '../HomePage/HomepageFeedPosting';

function ProfilepageFeed() {
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const [posts, setPosts] = useState([]);
    const [joinedposts, setJoinedPosts] = useState([]);

    const timeAgo = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0 second ago"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            decade: 315360000,
            year: 31536000,
            month: 2628000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        let elapsed = 0;
        let granularity = 0;
        let unit = '';

        for (const period in periods) {
            elapsed = Math.floor(secondsDifference / periods[period]);

            if (elapsed >= 1) {
                granularity = elapsed;
                unit = period;
                break;
            }
        }
        return `${granularity} ${unit}${granularity > 1 ? 's' : ''} ago`;
    };

    const formatJoinedDate = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "Unknown Date";
        }
        const dob = timestamp.toDate();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dob.toLocaleDateString('en-GB', options);
    };

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
            <HomepageFeedPosting />
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