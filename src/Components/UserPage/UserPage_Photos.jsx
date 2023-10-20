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
            `Posts/${user.uid}`,
            `Users/CoverImage/${user.uid}`,
            `Users/ProfileImage/${user.uid}`,
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
        <div className='userpagePhotos'>
            <div className="userpagePhotos_Top">
                <h3>Photos</h3>
                <a href="#">See all photos</a>
            </div>

            <div className="userpagePhotos_Bottom">
                <div className="userpagePhotos_BottomContainer">
                    {photoUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Photo ${index}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserPage_Photos;