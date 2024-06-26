import '../../CSS/HomePage/HomePage.css'
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { timeAgo } from '../../Assets/Utility/TimeModule';
import { setMsgAnyoneBoxVisibility } from '../../Redux/messageSlice';
import PostFeed from '../PostPage/PostFeed';
import ReelFeed from '../ReelPage/ReelFeed';
import MessageFriend from '../Message/MessageFriend';
import MessageAnyone from '../Message/MessageAnyone';
import HomepageFeedPosting from './HomepageFeedPosting';
import HomepageLeftbarOptions from './HomepageLeftbarOptions';
import HomepageRightbarGroupsList from './HomepageRightbarGroupsList';
import HomepageRightbarFriendsList from './HomepageRightbarFriendsList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const msgFriendBoxVisibility = useSelector((state) => state.data.message.msgFriendBoxVisibility);
    const msgAnyoneBoxVisibility = useSelector((state) => state.data.message.msgAnyoneBoxVisibility);
    const [posts, setPosts] = useState([]);

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

                <NavLink to="/videopage">
                    <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/XNFKm5WC2yS.png' title='Videos' />
                </NavLink>

                <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/MhkwI3R0SHP.png' title='Groups' />

                <NavLink to="/savedpage">
                    <HomepageLeftbarOptions src='https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k0Svfg6IJtR.png' title='Saved' />
                </NavLink>

                <HomepageLeftbarOptions icon={<KeyboardArrowDownIcon />} title='See more' />

                <div className='terms'>
                    <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
                </div>
            </div>

            <div className='homepageFeed'>
                <ReelFeed />
                <HomepageFeedPosting />

                {posts.map(post => {
                    return (
                        <PostFeed
                            key={post.id}
                            id={post.id}
                            userid={post.data.uid}
                            photoURL={post.data.photoURL}
                            media={post.data.media}
                            mediaType={post.data.mediaType}
                            username={post.data.username}
                            timestamp={timeAgo(post.data.timestamp)}
                            message={post.data.message}
                        />
                    );
                })}
            </div>

            <div className='homepageRightbar'>
                <div className="homepageRightbarTop">
                    <HomepageRightbarFriendsList />
                </div>

                <div className="homepageRightbarBottom">
                    <HomepageRightbarGroupsList />
                </div>
            </div>

            <div className="newMsg">
                <i id='newMsgIcon' onClick={() => dispatch(setMsgAnyoneBoxVisibility(true))}></i>
            </div>

            {msgAnyoneBoxVisibility && <MessageAnyone />}
            {msgFriendBoxVisibility && <MessageFriend />}
        </div>
    )
}

export default HomePage;