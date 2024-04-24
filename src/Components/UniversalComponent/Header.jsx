import '../../CSS/UniversalComponent/Header.css'
import fblogo from '../../Assets/Images/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../Redux/userSlice';
import { auth, db } from '../../Firebase/firebase';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { setSelectedPost } from '../../Redux/postSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [chats, setChats] = useState([])
    const [userChats, setUserChats] = useState('')
    const [notifications, setNotifications] = useState([])
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [userBoxVisible, setUserBoxVisible] = useState(false);
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const [notificationBoxVisible, setNotificationBoxVisible] = useState(false);
    const userBoxRef = useRef(null);
    const messageBoxRef = useRef(null);
    const notificationBoxRef = useRef(null);
    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

    const handleSignOut = () => {
        sessionStorage.removeItem('userData');

        auth.signOut()
            .then(() => {
                sessionStorage.removeItem('userData');
                dispatch(logoutUser())
                navigate('/')
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    const deleteUser = () => {
        if (auth.currentUser) {
            // Show a confirmation dialog
            const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

            if (confirmed) {
                const userUid = user.uid;

                // Delete user data in Firestore
                db.collection('Users')
                    .doc(userUid)
                    .delete()
                    .then(() => {
                        console.log('User data deleted from Firestore');
                    })
                    .catch((error) => {
                        console.error('Error deleting user data from Firestore:', error);
                    });

                // Delete user's posts in Firestore
                db.collection('Posts')
                    .where('uid', '==', userUid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // Delete each post
                            db.collection('Posts').doc(doc.id).delete();
                        });
                    })
                    .catch((error) => {
                        console.error('Error deleting user posts in Firestore:', error);
                    });

                // Delete the user's authentication account and sign out
                auth
                    .currentUser.delete()
                    .then(() => {
                        console.log('User authentication account deleted');
                        // Sign the user out after account deletion
                        auth.signOut()
                            .then(() => {
                                console.log('User signed out');
                            })
                            .catch((error) => {
                                console.error('Error signing the user out:', error);
                            });

                        handleSignOut();
                    })
                    .catch((error) => {
                        console.error('Error deleting user authentication account:', error);
                    });
            }
        }
    };

    const handleSearchInput = () => {
        setIsSearchBoxVisible(!isSearchBoxVisible);
    };

    const toggleUserBox = () => {
        setUserBoxVisible(!userBoxVisible);
    };

    const toggleNotificationBox = () => {
        setNotificationBoxVisible(!notificationBoxVisible);
    };

    const toggleMessageBox = () => {
        setMessageBoxVisible(!messageBoxVisible);
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

    const timeAgowithInitials = (timestamp) => {
        if (!timestamp || !timestamp.toDate) {
            return "0s"
        }
        const currentDate = new Date();
        const postDate = timestamp.toDate();
        const seconds = Math.floor((currentDate - postDate) / 1000);
        const secondsDifference = Math.max(seconds, 1);
        const periods = {
            D: 315360000,
            Y: 31536000,
            M: 2628000,
            w: 604800,
            d: 86400,
            h: 3600,
            m: 60,
            s: 1,
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
        return `${granularity}${unit}${granularity > 1 ? '' : ''}`;
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
                setUserBoxVisible(false);
            }

            if (notificationBoxRef.current && !notificationBoxRef.current.contains(e.target)) {
                setNotificationBoxVisible(false);
            }

            if (messageBoxRef.current && !messageBoxRef.current.contains(e.target)) {
                setMessageBoxVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [userBoxRef, notificationBoxRef, messageBoxRef]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                isSearchBoxVisible &&
                !document.querySelector(".header_search").contains(e.target)
            ) {
                setIsSearchBoxVisible(false);
                setSearchText('');
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [isSearchBoxVisible]);

    useEffect(() => {
        if (searchText === '') {
            // Reset matching usernames when search input is empty
            setMatchingUsernames([]);
            return;
        }

        db.collection("Users")
            .get()
            .then((querySnapshot) => {
                const matchingUsernames = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            Uid: data.Uid,
                            username: data.username,
                            photoURL: data.photoURL,
                        };
                    })
                    .filter((user) =>
                        user.username.toLowerCase().includes(searchText.toLowerCase())
                    );
                setMatchingUsernames(matchingUsernames);
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    }, [searchText]);

    useEffect(() => {
        const likesData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Likes');
        const commentData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Comments');
        const friendReqData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('FriendsReqs');

        // Use Promise.all to wait for all promises to resolve
        Promise.all([
            likesData.get(),
            commentData.get(),
            friendReqData.get(),
        ]).then((results) => {
            const likes = results[0].docs.map((doc) => doc.data());
            const comments = results[1].docs.map((doc) => doc.data());
            const friendReqs = results[2].docs.map((doc) => doc.data());

            // Combine data from all collections
            const notifications = [...likes, ...comments, ...friendReqs];

            // Sort the combined array based on timestamps in ascending order
            notifications.sort((a, b) => b.timestamp - a.timestamp);

            // Set the combined and sorted data to your state
            setNotifications(notifications);
        }).catch((error) => {
            console.error('Error fetching notifications:', error);
        });
    }, [user.uid]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await db.collection('Chats').get();

                if (!querySnapshot.empty) {
                    const chatsData = [];

                    querySnapshot.forEach(doc => {
                        const chatData = doc.data();
                        // Retrieve the messages list from the chatData
                        const messagesData = chatData.messages || []; // Ensure messagesData is an array
                        chatData.messages = messagesData;
                        chatsData.push(chatData);
                    });

                    setChats(chatsData);
                } else {
                    setChats([]);
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setChats([]);
            }
        };
        fetchData();

    }, [user.uid]);

    useEffect(() => {
        const relevantChats = chats
            .map(chat => (chat.recipientUid === user.uid || chat.senderUid === user.uid) ? chat : null)
            .filter(Boolean);
        setUserChats(relevantChats)
    }, [chats, user.uid]);

    return (
        <div className={`header ${showHeader ? '' : 'transformed'}`}>
            <div className='headerTransformedLeft'>
                <NavLink to={'/homepage'}>
                    <CloseIcon className='closeIcon' />
                    <img src={fblogo} alt="" />
                </NavLink>
            </div>

            <div className='headerLeft'>
                <NavLink to={'/homepage'}>
                    <img src={fblogo} alt="" />
                </NavLink>
                
                <div className='searchContainer'>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder='Search Facebook'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onClick={handleSearchInput}
                    />
                    {isSearchBoxVisible && (
                        <div className="searchContainerDropbox">
                            {matchingUsernames.length === 0 ? (
                                <p>No matches</p>
                            ) : (
                                matchingUsernames.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`searchContainerDropboxResults ${selectedUser === user.id ? "selected" : ""}`}
                                        onClick={() => {
                                            setSelectedUser(user.id);
                                            setIsSearchBoxVisible(false);
                                            setSearchText('');
                                        }}
                                    >
                                        <NavLink to={`/frienduserpage/${user.id}`}>
                                            <Avatar src={user.photoURL} />
                                            <p>{user.username}</p>
                                        </NavLink>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="headerMiddle">
                <NavLink to="/homepage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <HomeIcon /> : <HomeOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/friendpage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <PeopleAltIcon /> : <PeopleAltOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/videospage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <SmartDisplayIcon /> : <SmartDisplayOutlinedIcon />
                    )}
                </NavLink>

                <NavLink to="/grouppage" activeclassname="active">
                    {({ isActive }) => (
                        isActive ? <GroupsIcon /> : <GroupsOutlinedIcon />
                    )}
                </NavLink>
            </div>

            <div className="headerRight">
                <AppsIcon className='headerRight_Options' />

                <div className={`messageBox ${userBoxVisible ? 'clicked' : ''}`}>
                    {userChats.length > 0 && <p id='msgLengthIcon'>{userChats.length}</p>}

                    <ForumIcon className='headerRight_Options' id='msgIcon' onClick={toggleMessageBox} ref={messageBoxRef} />
                    {messageBoxVisible && (
                        <div className="headerBox">
                            <div className='headerBox_Top'>
                                <div className='headerBox_TopTop'>
                                    <h3>Chats</h3>
                                    <MoreHorizIcon />
                                </div>

                                <div className='headerBox_TopMiddle'>
                                    <SearchIcon />
                                    <input type="text" name="" id="" placeholder='Search Messenger' />
                                </div>

                                <div className='headerBox_TopBottom'>
                                    <button>Inbox</button>
                                    <button>Communities</button>
                                </div>
                            </div>

                            <div className='headerBox_Bottom'>
                                {userChats.length == 0 ? (
                                    <p id='noMsg'>No messages found.</p>
                                ) : (
                                    <>
                                        {chats.map((chat, index) => {
                                            // Check if the current user is either the sender or recipient of the chat
                                            if (chat.senderUid === user.uid || chat.recipientUid === user.uid) {
                                                return (
                                                    <div key={index}>
                                                        {/* Rendering only the last message in the chat */}
                                                        {chat.messages.slice(-1).map((message, index) => (
                                                            <div key={index}>
                                                                {message.sender !== user.uid ? (
                                                                    <div className='headerBox_BottomOption'>
                                                                        <Avatar src={message.senderPhotoUrl} />
                                                                        <div className='headerBox_BottomOptionContent'>
                                                                            <p>{message.senderName}</p>
                                                                            <div className='headerBox_BottomOptionContentBottom'>
                                                                                <span>{message.text}</span>
                                                                                <p> · </p>
                                                                                <h5>{timeAgowithInitials(message.timestamp)}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className='headerBox_BottomOption'>
                                                                        <Avatar src={message.recipientPhotoUrl} />
                                                                        <div className='headerBox_BottomOptionContent'>
                                                                            <p>{message.recipientName}</p>
                                                                            <div className='headerBox_BottomOptionContentBottom'>
                                                                                <span>{message.text}</span>
                                                                                <p> · </p>
                                                                                <h5>{timeAgowithInitials(message.timestamp)}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={`notificationBox ${userBoxVisible ? 'clicked' : ''}`}>
                    {notifications.length > 0 && <p id='notiLengthIcon'>{notifications.length}</p>}

                    <NotificationsIcon className='headerRight_Options' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {notificationBoxVisible && (
                        <div className="headerBox">
                            <div className='headerBox_Top'>
                                <div className='headerBox_TopTop'>
                                    <h3>Notifications</h3>
                                    <MoreHorizIcon />
                                </div>

                                <div className='headerBox_TopBottom'>
                                    <button>All</button>
                                    <button>Unread</button>
                                </div>
                            </div>

                            <div className='headerBox_Bottom'>
                                {notifications.length == 0 ? (
                                    <p id='noNoti'>No notifications found.</p>
                                ) : (
                                    <div className='headerBox_BottomOptions'>
                                        {notifications.map((notification, index) => (
                                            <div className='headerBox_BottomOption' key={index}>
                                                {(notification.status == 'reacted') || (notification.status == 'commented') ? (
                                                    <NavLink to={`/profilepage/${notification.postuserid}/post/${notification.postid}`} onClick={() => dispatch(setSelectedPost(notification.postid))}>
                                                        <div className='headerBox_BottomOption_Left'>
                                                            <Avatar src={notification.userphotoUrl} />
                                                        </div>
                                                        <div className="headerBox_BottomOption_Right">
                                                            <p> <span>{notification.username}</span> has {notification.status} on your post</p>
                                                            <h5>{timeAgo(notification.timestamp)}</h5>
                                                        </div>
                                                    </NavLink>
                                                ) : (
                                                    <>
                                                        <div className='headerBox_BottomOption_Left'>
                                                            <Avatar src={notification.senderPhotoUrl} />
                                                        </div>
                                                        <div className="headerBox_BottomOption_Right">
                                                            <p><span>{notification.senderName}</span> has sent you a friend request</p>
                                                            <h5>{timeAgo(notification.timestamp)}</h5>
                                                            <div className="headerBox_BottomOption_RightBottom">
                                                                <button id='confbtn'>Confirm</button>
                                                                <button id='delbtn'>Delete</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={`userBox ${userBoxVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} onClick={toggleUserBox} ref={userBoxRef} />
                    {userBoxVisible && (
                        <div className="headerBox">
                            <NavLink to="/userhomepage/post">
                                <div className='headerBoxOptions'>
                                    <div className='headerBoxOptions_Left'>
                                        <Avatar src={user.photoURL} />
                                        <p>{user.username}</p>
                                    </div>
                                </div>
                            </NavLink>

                            <div className='headerBoxOptions'>
                                <div className='headerBoxOptions_Left'>
                                    <SettingsIcon />
                                    <p>Setting & privacy</p>
                                </div>
                                <div className='headerBoxOptions_Right'>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>

                            <div className='headerBoxOptions'>
                                <div className='headerBoxOptions_Left'>
                                    <HelpIcon />
                                    <p>Help & support</p>
                                </div>
                                <div className='headerBoxOptions_Right'>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>

                            <div className='headerBoxOptions'>
                                <div className='headerBoxOptions_Left'>
                                    <NightlightIcon />
                                    <p>Display & accessibility</p>
                                </div>
                                <div className='headerBoxOptions_Right'>
                                    <ArrowForwardIosIcon />
                                </div>
                            </div>

                            <div className='headerBoxOptions' onClick={handleSignOut}>
                                <div className='headerBoxOptions_Left'>
                                    <LogoutIcon />
                                    <p>Log out</p>
                                </div>
                            </div>

                            <div className='terms'>
                                <p><span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad choices</span> · <span>Cookies</span> · <span>More</span> · <span>Meta © 2023</span></p>
                            </div>
                            {/* <button onClick={deleteUser}>Delete</button> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;