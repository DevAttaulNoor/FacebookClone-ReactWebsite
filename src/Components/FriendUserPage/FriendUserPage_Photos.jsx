import '../../CSS/FriendUserPage/FriendUserPage_Photos.css'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from "firebase/compat/app";

function FriendUserPage_Photos() {
    const { friendUid } = useParams();
    const [photoUrls, setPhotoUrls] = useState([]);

    useEffect(() => {
        // Reference to the user's folders in Firebase Storage
        const storageRefs = [
            `Images/Posts/${friendUid}`,
            `Images/Users/CoverImage/${friendUid}`,
            `Images/Users/ProfileImage/${friendUid}`,
        ];

        // Fetch images from all specified paths
        const fetchImages = async () => {
            const urls = [];

            for (const storagePath of storageRefs) {
                const storageRef = firebase.storage().ref(storagePath);

                // List items (photos) in the user's folder
                try {
                    const result = await storageRef.listAll();

                    // Get download URLs for each item (photo)
                    const urlsForPath = await Promise.all(
                        result.items.map((itemRef) => itemRef.getDownloadURL())
                    );

                    urls.push(...urlsForPath);
                } catch (error) {
                    console.error(`Error fetching photos from ${storagePath}:`, error);
                }
            }

            // Update the state with photo URLs
            setPhotoUrls(urls);
        };

        fetchImages();
    }, [friendUid]);

    return (
        <div className='frienduserpage_Photo'>
            <div className="frienduserpage_PhotoTop">
                <h2>Photos</h2>
                <a href="#">See all photos</a>
            </div>
            <div className="frienduserpage_PhotoBottom">
                <div className="grid-container">
                    {photoUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Photo ${index}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FriendUserPage_Photos