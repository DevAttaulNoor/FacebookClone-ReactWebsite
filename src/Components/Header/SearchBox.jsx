import '../../CSS/Header/SearchBox.css';
import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBoxVisible } from '../../Redux/searchSlice';
import { db } from '../../Firebase/firebase';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function SearchBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const [searchText, setSearchText] = useState('');
    const [matchingUsernames, setMatchingUsernames] = useState([]);

    const handleSearchBoxVisibility = () => {
        setSearchText('');
        dispatch(setSearchBoxVisible(false));
    }

    useEffect(() => {
        if (searchText === '') {
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
                    .filter((person) =>
                        person.username.toLowerCase().includes(searchText.toLowerCase()) &&
                        person.username !== user.username
                    );
                setMatchingUsernames(matchingUsernames);
            })
            .catch((error) => {
                console.error('Error getting documents:', error);
            });
    }, [searchText, user.username]);

    return (
        <div className="searchBox">
            <div className="searchBoxTop">
                <div className='svgBox' onClick={() => dispatch(setSearchBoxVisible(false))}>
                    <KeyboardBackspaceIcon />
                </div>

                <input
                    type="text"
                    placeholder='Search Facebook'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="searchBoxBottom">
                {matchingUsernames.length > 0 ? (
                    matchingUsernames.map((matchingUser) => (
                        <div className='searchBoxBottomOption' key={matchingUser.id} onClick={() => handleSearchBoxVisibility()}>
                            {matchingUser.id === user.uid ? (
                                <NavLink to={`/userhomepage/post`}>
                                    <Avatar src={user.photoURL} />
                                    <p>{user.username}</p>
                                </NavLink>
                            ) : (
                                <NavLink to={`/profilepage/${matchingUser.id}/post`}>
                                    <Avatar src={matchingUser.photoURL} />
                                    <p>{matchingUser.username}</p>
                                </NavLink>
                            )}
                        </div>
                    ))
                ) : (
                    <p id='noMatch'>No match found</p>
                )}
            </div>
        </div >
    )
}

export default SearchBox