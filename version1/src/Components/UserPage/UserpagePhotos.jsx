import "../../CSS/UserPage/UserpagePhotos.css";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import firebase from "firebase/compat/app";
import LazyLoadingImage from "../../Assets/Utility/LazyLoadingImage";

function UserpagePhotos() {
    const user = useSelector((state) => state.data.user.user);
    const [photoUrls, setPhotoUrls] = useState([]);

    useEffect(() => {
        const storageRefs = [
            `Posts/${user.uid}`,
            `Users/${user.uid}`
        ];

        const fetchImages = async () => {
            const urls = [];

            for (const storagePath of storageRefs) {
                const storageRef = firebase.storage().ref(storagePath);

                try {
                    const result = await storageRef.listAll();

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

                    const urlsForImages = await Promise.all(
                        imageItems.map(itemRef => itemRef.getDownloadURL())
                    );

                    urls.push(...urlsForImages);
                }

                catch (error) {
                    console.error(`Error fetching photos from ${storagePath}:`, error);
                }
            }
            setPhotoUrls(urls);
        };
        fetchImages();
    }, [user]);

    return (
        <>
            {photoUrls.length > 0 && (
                <div className='userpagePhotos'>
                    <div className="userpagePhotosTop">
                        <h3>Photos</h3>
                        <NavLink to="/userhomepage/photo" activeclassname="active">
                            See all photos
                        </NavLink>
                    </div>

                    <div className="userpagePhotosBottom">
                        <div className="userpagePhotosBottomContainer">
                            {photoUrls.map((url, index) => (
                                <LazyLoadingImage
                                    key={index}
                                    effect={'blur'}
                                    lowResSrc={url}
                                    highResSrc={url}
                                    alt={`pic${index}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserpagePhotos;