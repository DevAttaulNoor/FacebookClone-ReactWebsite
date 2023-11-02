import '../../CSS/HomePage/HomePage_Messages.css'
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../BackendRelated/Firebase';
import { Avatar } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function HomePage_Messages({ close }) {
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState("");
    const [searchText, setSearchText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const dialogBoxRef = useRef(null);

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

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker); // Toggle the state to show/hide the emoji picker
    };

    const handleEmojiClick = (event) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        toggleEmojiPicker();
    };

    const toggleDialog = () => {
        setIsDialogVisible(!isDialogVisible);
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

    return (
        <div className='HomePageMessages'>
            <div className="HomePageMessages_Top">
                <div className='HomePageMessages_TopLeft'>
                    <p>New message</p>
                </div>

                <div className='HomePageMessages_TopRight'>
                    <HorizontalRuleIcon />
                    <CloseIcon onClick={close} />
                </div>
            </div>

            <div className="HomePageMessages_Middle">
                <p id='toText'>To: </p>

                <div className="HomePageMessages_MiddleRight">
                    {selectedUsers.length > 0 && (
                        <div className="selectedUserSection">
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
                        onClick={() => setIsSearchBoxVisible(!isSearchBoxVisible)}
                    />
                </div>
            </div>

            <div className="HomePageMessages_Bottom">
                {selectedUsers.length > 0 && (
                    <div className="HomePageMessages_BottomInner">
                        {selectedUsers.map((user) => (
                            <div key={user.userId} className="HomePageMessages_BottomInner_Top">
                                <Avatar src={user.photoURL} />
                                <p>{user.username}</p>
                            </div>
                        ))}

                        <div className='HomePageMessages_BottomInner_Bottom'>
                            <AddCircleIcon />
                            <div className='inputSection'>
                                <input type='text' placeholder='Aa' value={comment} onChange={(e) => setComment(e.target.value)} />
                                <EmojiEmotionsIcon className='emojiIcon' onClick={toggleDialog} ref={dialogBoxRef} />

                            </div>
                            {isDialogVisible && (
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            )}
                            <SendIcon />
                        </div>
                    </div>
                )}

                {searchText !== '' && matchingUsernames.length === 0 ? (
                    <p id='noMatch'>No matches</p>
                ) : (
                    matchingUsernames.map((user) => (
                        <div
                            key={user.id}
                            className={`HomePageMessages_BottomResults ${selectedUsers.includes(user.id) ? "selected" : ""}`}
                            onClick={() => toggleUserSelection(user.id, user.username, user.photoURL)}
                        >
                            <Avatar src={user.photoURL} />
                            <p>{user.username}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomePage_Messages