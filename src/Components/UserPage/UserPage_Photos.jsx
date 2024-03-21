import "../../CSS/UserPage/UserPage_Photos.css";
import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import { NavLink } from "react-router-dom";
import { useStateValue } from "../BackendRelated/StateProvider";

function UserPage_Photos() {
    const [{ user }] = useStateValue();
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
        <div className='userpagePhotos'>
            <div className="userpagePhotos_Top">
                <NavLink id="navLink" to="/userhomepage/photo" activeclassname="active">
                    <h3>Photos</h3>
                </NavLink>
                <a id="seeAllLink" href="#">See all photos</a>
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