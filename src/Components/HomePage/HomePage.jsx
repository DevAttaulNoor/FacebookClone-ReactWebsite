import '../../CSS/HomePage/HomePage.css'
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { db } from '../../Firebase/firebase';
import HomepageMessage from './HomepageMessage';
import HomepageFeedReels from './HomepageFeedReels';
import HomepageFeedPosts from './HomepageFeedPosts';
import HomepageFeedPosting from './HomepageFeedPosting';
import HomepageLeftbarOptions from './HomepageLeftbarOptions';
import HomepageRightbarGroupsList from './HomepageRightbarGroupsList';
import HomepageRightbarFriendsList from './HomepageRightbarFriendsList';
import Skeleton_Post from '../Skeletons/Skeleton_Post'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function HomePage() {
    const user = useSelector((state) => state.data.user.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageBox, setMessageBox] = useState(false);

    const closeMessageBox = () => {
        setMessageBox(false);
    };

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

    useEffect(() => {
        const unsubscribe = db.collection("Posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const filteredPosts = snapshot.docs
                    .filter(doc => !doc.data().dob)
                    .map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));

                setPosts(filteredPosts);
                setLoading(false);
            });
        return () => unsubscribe();
    }, []);

    return (
        <div className='homepage'>
            <div className='homepageLeftbar'>
                <NavLink to="/userhomepage/post">
                    <HomepageLeftbarOptions src={user.photoURL} title={user.username} />
                </NavLink>

                <NavLink to="/friendpage">
                    <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/i0pziEs5Wj6.png' title='Friends' />
                </NavLink>

                <NavLink to="/videospage">
                    <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
                </NavLink>

                <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />

                <NavLink to="/savedpage">
                    <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
                </NavLink>

                <HomepageLeftbarOptions Icon={ArrowDropDownIcon} title='See more' />

                <div className='terms'>
                    <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
                </div>
            </div>

            <div className='homepageFeed'>
                <HomepageFeedReels />
                <HomepageFeedPosting />

                {loading ? (
                    <div className='postSkeleton'>
                        <Skeleton_Post />
                        <Skeleton_Post />
                    </div>
                ) : (
                    <>
                        {posts.map(post => {
                            return (
                                <div key={post.id}>
                                    <HomepageFeedPosts
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
                    </>
                )}
            </div>

            <div className='homepageRightbar'>
                <div className="homepageRightbarTop">
                    <HomepageRightbarFriendsList />
                </div>

                <hr id='line' />

                <div className="homepageRightbarBottom">
                    <HomepageRightbarGroupsList />
                </div>
            </div>

            <div className="newMsgContainer">
                <div id='newMsg'>
                    <i onClick={() => setMessageBox(true)}></i>
                </div>

                {messageBox && (
                    <HomepageMessage handleMessageBox={messageBox} closeBox={closeMessageBox} />
                )}
            </div>
        </div>
    )
}

export default HomePage;