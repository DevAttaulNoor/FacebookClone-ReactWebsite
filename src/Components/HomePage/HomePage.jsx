import '../../CSS/HomePage/HomePage.css'
import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { db } from '../BackendRelated/Firebase';
import HomePage_Feeds from './HomePage_Feeds'
import HomePage_Leftbar from './HomePage_Leftbar'
import HomePage_Rightbar from './HomePage_Rightbar'
import CloseIcon from '@mui/icons-material/Close'

function HomePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);

    const openNewMessageModal = () => {
        setIsDialogOpen(true);
    }

    const closeNewMessageModal = () => {
        setIsDialogOpen(false);
    }

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

    const toggleUserSelection = (userId, username, photoURL) => {
        const isUserSelected = selectedUsers.some(user => user.userId === userId);
        if (!isUserSelected) {
            // Select the user and store the username and photoURL
            setSelectedUsers([...selectedUsers, { userId, username, photoURL }]);
        }
        setSearchText('');
    };

    const deselectUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
    };


    return (
        <div className='homepage'>
            <div className='homepage_Leftbar'>
                <HomePage_Leftbar />
            </div>
            <div className='homepage_MainFeed'>
                <HomePage_Feeds />
            </div>
            <div className='homepage_Rightbar'>
                <HomePage_Rightbar />
            </div>

            <div className="msgRelated">
                <div id='newMsg'>
                    <i onClick={openNewMessageModal}></i>
                </div>

                {isDialogOpen && (
                    <div className="newMsgDialog">
                        <div className="newMsgDialog_Top">
                            <p>New message</p>
                            <CloseIcon onClick={() => setIsDialogOpen(false)} />
                        </div>

                        <div className="newMsgDialog_Middle">
                            <p id='toText'>To: </p>
                            <div className="newMsgDialog_MiddleRight">
                                {selectedUsers.length > 0 && (
                                    <div className="selectedUsers">
                                        {selectedUsers.map((user) => (
                                            <div key={user.userId} className="selectedUser">
                                                <p>{user.username}</p>
                                                <CloseIcon onClick={() => deselectUser(user.userId)} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onClick={handleSearchInput}
                                />
                            </div>
                        </div>

                        <div className="newMsgDialog_Bottom">
                            {selectedUsers.length > 0 && (
                                <div className="newMsgDialog_BottomMiddle">
                                    {selectedUsers.map((user) => (
                                        <div key={user.userId} className="newMsgDialog_BottomMiddleInner">
                                            <Avatar src={user.photoURL} />
                                            <p>{user.username}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchText !== '' && matchingUsernames.length === 0 ? (
                                <p>No matches</p>
                            ) : (
                                matchingUsernames.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`newMsgDialog_BottomResults ${selectedUsers.includes(user.id) ? "selected" : ""}`}
                                        onClick={() => toggleUserSelection(user.id, user.username, user.photoURL)}
                                    >
                                        <Avatar src={user.photoURL} />
                                        <p>{user.username}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div >
                )}
            </div >
        </div >
    )
}

export default HomePage;