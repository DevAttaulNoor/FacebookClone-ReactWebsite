import "../../CSS/UserPage/UserPage_Photos.css";
import React, { useEffect, useState } from 'react';
import { useStateValue } from "../BackendRelated/StateProvider";
import firebase from "firebase/compat/app";

function UserPage_Photos() {
    const [{ user }] = useStateValue();
    const [photoUrls, setPhotoUrls] = useState([]);

    useEffect(() => {
        // Reference to the user's folders in Firebase Storage
        const storageRefs = [
            `Images/Posts/${user.uid}`,
            `Images/Users/CoverImage/${user.uid}`,
            `Images/Users/ProfileImage/${user.uid}`,
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
            setPhotoUrls(urls);
        };
        fetchImages();
    }, [user]);

    return (
        <div className='userpage_Photos'>
            <div className="userpage_Photos_top">
                <h2>Photos</h2>
                <a href="#">See all photos</a>
            </div>
            <div className="userpage_Photos_bottom">
                <div className="grid-container">
                    {photoUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Photo ${index}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserPage_Photos;