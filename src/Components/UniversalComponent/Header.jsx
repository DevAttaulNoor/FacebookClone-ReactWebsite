import '../../CSS/UniversalComponent/Header.css'
import fblogo from '../../Imgs/fblogo.png'
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Navigate, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { auth, db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

function Header() {
    const [{ user }, dispatch] = useStateValue();
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const dialogBoxRef = useRef(null);

    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

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

    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(e.target)) {
                setIsDialogVisible(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const handleSearchInput = () => {
        setIsSearchBoxVisible(!isSearchBoxVisible);
    };

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
                    <HomeIcon />
                </NavLink>

                <NavLink to="/friendpage" activeClassName="active">
                    <PeopleIcon />
                </NavLink>

                <NavLink to="/videospage" activeClassName="active">
                    <SmartDisplayIcon />
                </NavLink>

                <NavLink to="/grouppage" activeClassName="active">
                    <GroupsIcon />
                </NavLink>
            </div>

            <div className="header_right">
                <AppsIcon />
                <ForumIcon id='msgIcon' />
                <NotificationsIcon />

                <div className={`header_rightAvatarBox ${isDialogVisible ? 'clicked' : ''}`}>
                    <Avatar src={user.photoURL} onClick={toggleDialog} ref={dialogBoxRef} />
                    {isDialogVisible && (
                        <div className="dialogBox">
                            <NavLink to="/userhomepage/post">
                                <button>Home</button>
                            </NavLink>
                            <button onClick={deleteUser}>Delete</button>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Header;