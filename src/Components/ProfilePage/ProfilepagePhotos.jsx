import "../../CSS/ProfilePage/ProfilepagePhotos.css";
import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function ProfilepagePhotos() {
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const [photoUrls, setPhotoUrls] = useState([]);

    useEffect(() => {
        // Reference to the user's folders in Firebase Storage
        const storageRefs = [
            `Posts/${selectedFriend}`,
            `Users/${selectedFriend}`
        ];

        // Fetch images from all specified paths
        const fetchImages = async () => {
            const urls = [];

            for (const storagePath of storageRefs) {
                const storageRef = firebase.storage().ref(storagePath);

                // List items (files) in the user's folder
                try {
                    const result = await storageRef.listAll();

                    // Filter items to include only image files (you can adjust the condition as needed)
                    const imageItems = result.items.filter(itemRef => {
                        const name = itemRef.name.toLowerCase();
                        return (
                            name.endsWith('.jpg') ||
                            name.endsWith('.jpeg') ||
                            name.endsWith('.png') ||
                            name.endsWith('.gif') ||
                            name.endsWith('.bmp')
                        );
                    });

                    // Get download URLs for each image item
                    const urlsForImages = await Promise.all(
                        imageItems.map(itemRef => itemRef.getDownloadURL())
                    );

                    urls.push(...urlsForImages);
                } catch (error) {
                    console.error(`Error fetching photos from ${storagePath}:`, error);
                }
            }
            setPhotoUrls(urls);
        };
        fetchImages();
    }, [selectedFriend]);

    return (
        <div className='profilePagePhotos'>
            <div className="profilePagePhotos_Top">
                <NavLink id="navLink" to="/profilepage/:userid/photo" activeClassName="active">
                    <h3>Photos</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all photos</a>
            </div>

            <div className="profilePagePhotos_Bottom">
                <div className="profilePagePhotos_BottomContainer">
                    {photoUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Photo ${index}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfilepagePhotos;