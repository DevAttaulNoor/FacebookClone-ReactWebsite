import "../CSS/HomePage.css"
import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function HomePage() {
    const [{ user }, dispatch] = useStateValue();

    // You can replace these URLs with actual image URLs for the profile picture and cover photo.
    const profilePictureUrl = 'https://example.com/profile-picture.jpg';
    const coverPhotoUrl = 'https://example.com/cover-photo.jpg';

    return (
        <div className="user-home-page">
            <div className="cover-photo">
                <img src={coverPhotoUrl} alt="Cover" />
            </div>
            <div className="profile-section">
                <img src={user.photoURL} alt="Profile" className="profile-picture" />
                <h1>{user.displayName}</h1>
                {/* Add more user information here */}
            </div>
            {/* Add other Facebook-like components such as posts, friends list, etc. */}
            <Link to="/">Go Back</Link>
        </div>
    );
}

export default HomePage;