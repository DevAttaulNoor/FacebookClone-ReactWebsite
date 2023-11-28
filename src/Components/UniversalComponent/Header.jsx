import '../../CSS/UniversalComponent/Header.css'
import fblogo from '../../Imgs/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { auth, db } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';

import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


function Header() {
    const [{ user }, dispatch] = useStateValue();
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [userBoxVisible, setUserBoxVisible] = useState(false);
    const [notificationBoxVisible, setNotificationBoxVisible] = useState(false);
    const userBoxRef = useRef(null);
    const notificationBoxRef = useRef(null);

    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

    const [notifications, setNotifications] = useState({
        likes: [],
        comments: [],
        friendsReqs: [],
    });

    const handleSignOut = () => {
        sessionStorage.removeItem('userData');
        sessionStorage.setItem('userLoggedOut', 'true');

        auth.signOut()
            .then(() => {
                sessionStorage.removeItem('userData');

                // Set the user to null to indicate they are signed out
                dispatch({
                    type: "SET_USER",
                    user: null,
                });
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

                // // Delete the entire subfolder corresponding to the user's UID in Storage
                // storage.ref(`Users/${user.uid}`).delete()
                //     .then(() => {
                //         console.log('User data deleted from Storage');
                //     })
                //     .catch((error) => {
                //         console.error('Error deleting user data from Storage:', error);
                //     });

                // // Delete the entire subfolder corresponding to the post's UID in Storage
                // storage.ref(`Posts/${user.uid}`).delete()
                //     .then(() => {
                //         console.log('User posts data deleted from Storage');
                //     })
                //     .catch((error) => {
                //         console.error('Error deleting user posts from Storage:', error);
                //     });

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

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
                setUserBoxVisible(false);
            }

            if (notificationBoxRef.current && !notificationBoxRef.current.contains(e.target)) {
                setNotificationBoxVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [userBoxRef, notificationBoxRef]);

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
        const unsubscribeLikes = listenToNotifications('Likes', setLikesData);
        const unsubscribeComments = listenToNotifications('Comments', setCommentsData);
        const unsubscribeFriendsReqs = listenToNotifications('FriendsReqs', setFriendsReqsData);

        // Cleanup function
        return () => {
            unsubscribeLikes();
            unsubscribeComments();
            unsubscribeFriendsReqs();
        };
    }, [user.uid]);

    const listenToNotifications = (collectionName, setDataCallback) => {
        const collectionRef = db
            .collection('Users')
            .doc(user.uid)
            .collection('Notifications')
            .doc(user.uid)
            .collection(collectionName);

        return collectionRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            setDataCallback(data);
        });
    };

    const setLikesData = (data) => {
        setNotifications((prevNotifications) => ({ ...prevNotifications, likes: data }));
    };

    const setCommentsData = (data) => {
        setNotifications((prevNotifications) => ({ ...prevNotifications, comments: data }));
    };

    const setFriendsReqsData = (data) => {
        setNotifications((prevNotifications) => ({ ...prevNotifications, friendsReqs: data }));
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

    return (
        <div className={`header ${showHeader ? '' : 'transformed'}`}>
            <div className='Transformed_header_left'>
                <NavLink to={'/homepage'}>
                    <CloseIcon className='closeIcon' />
                    <img src={fblogo} alt="" />
                </NavLink>
            </div>

            <div className='header_left'>
                <NavLink to={'/homepage'}>
                    <img src={fblogo} alt="" />
                </NavLink>
                <div className='header_search'>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder='Search Facebook'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onClick={handleSearchInput}
                    />
                    {isSearchBoxVisible && (
                        <div className="headersearch_Dropbox">
                            {matchingUsernames.length === 0 ? (
                                <p>No matches</p>
                            ) : (
                                matchingUsernames.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`headersearch_DropboxResults ${selectedUser === user.id ? "selected" : ""}`}
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

            <div className="header_middle">
                <NavLink to="/homepage" activeClassName="active">
                    <HomeOutlinedIcon />
                </NavLink>

                <NavLink to="/friendpage" activeClassName="active">
                    <GroupOutlinedIcon />
                </NavLink>

                <NavLink to="/videospage" activeClassName="active">
                    <OndemandVideoOutlinedIcon />
                </NavLink>

                <NavLink to="/grouppage" activeClassName="active">
                    <GroupsOutlinedIcon />
                </NavLink>
            </div>

            <div className="header_right">
                <AppsIcon className='header_right_Options' />
                <ForumIcon className='header_right_Options' id='msgIcon' />

                <div className={`notificationBox ${userBoxVisible ? 'clicked' : ''}`}>
                    <NotificationsIcon className='header_right_Options' onClick={toggleNotificationBox} ref={notificationBoxRef} />
                    {notificationBoxVisible && (
                        <div className="headerBox">
                            <div className='headerBox_Top'>
                                <div className='headerBox_TopTop'>
                                    <h2>Notifications</h2>
                                    <MoreHorizIcon />
                                </div>

                                <div className='headerBox_TopBottom'>
                                    <p>All</p>
                                    <p>Unread</p>
                                </div>
                            </div>

                            <div className='headerBox_Bottom'>
                                {notifications.likes.length === 0 && notifications.comments.length === 0 && notifications.friendsReqs.length === 0 ? (
                                    <p>Nothing new to show</p>
                                ) : (
                                    <div>
                                        {notifications.likes.map((like, index) => (
                                            like.postuserid === user.uid && (
                                                <div key={index}>
                                                    <Avatar src={like.likeduserphotoUrl} />
                                                    <p>{like.likedusername} has {like.status} on your post {like.postid}</p>
                                                    <p>{timeAgo(like.timestamp)}</p>
                                                </div>
                                            )
                                        ))}

                                        {notifications.comments.map((comment, index) => (
                                            comment.postuserid === user.uid && (
                                                <div key={index}>
                                                    <Avatar src={comment.commentuserphotoUrl} />
                                                    <p>{comment.commentusername} has {comment.status} '{comment.commenttext}' on your post {comment.postid}</p>
                                                    <p>{timeAgo(comment.timestamp)}</p>
                                                </div>
                                            )
                                        ))}

                                        {notifications.friendsReqs.map((friendReq, index) => (
                                            friendReq.receiverUid === user.uid && (
                                                <div key={index}>
                                                    <Avatar src={friendReq.senderPhotoUrl} />
                                                    <p>{friendReq.senderName} has sent you a friend request</p>
                                                    <p>{timeAgo(friendReq.timestamp)}</p>
                                                    <button>Accept</button>
                                                    <button>Delete</button>
                                                    {/* If delete button is pressed than the buttons are removed and a "Request removed" is shown insted of the buttons */}
                                                    {/* If Accept button is pressed than the buttons are removed and a "Request accepted" is shown insted of the buttons */}
                                                </div>
                                            )
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
        </div >
    )
}

export default Header;