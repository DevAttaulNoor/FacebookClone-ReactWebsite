import '../../CSS/HomePage/HomePage_StoryReels.css'
import React, { useState, useRef } from 'react';
import { db, storage } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import TitleIcon from '@mui/icons-material/Title';
import SettingsIcon from '@mui/icons-material/Settings';
import firebase from "firebase/compat/app"

function HomePage_StoryReels() {
    const colors = ['blue', 'red', 'green', 'black', 'brown', 'yellow', 'blueviolet', 'cyan', 'gold', 'violet', 'silver', 'purple'];
    const [{ user }] = useStateValue()
    const [activeDot, setActiveDot] = useState(colors[0]);
    const [showForText, setShowForText] = useState(false);
    const [showTextContent, setShowTextContent] = useState(false);
    const [showForPhoto, setShowForPhoto] = useState(false);
    const [showPhotoContent, setShowPhotoContent] = useState(false);
    const [showAddText, setShowAddText] = useState(false);
    const [showCards, setShowCards] = useState(true);
    const [textAreaValue, setTextAreaValue] = useState("");
    const inputRef = useRef(null);
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleDotClick = (color) => {
        setActiveDot(color);
    };

    const handleAddTextClick = () => {
        setShowForText(true);
        setShowTextContent(true);
        setShowAddText(false);
        setShowForPhoto(false);
        setShowPhotoContent(false);
        setShowCards(false);
    };

    const handleAddPhotoClick = () => {
        setShowForText(false);
        setShowTextContent(false);
        setShowAddText(true);
        setShowForPhoto(false);
        setShowPhotoContent(true);
        setShowCards(false);
        inputRef.current.click();
    };

    const handleDiscardClick = () => {
        setTextAreaValue("");
        setImage('');
        setActiveDot(colors[0]);
        setShowForText(false);
        setShowTextContent(false);
        setShowForPhoto(false);
        setShowPhotoContent(false);
        setShowAddText(false);
        setShowCards(true);

        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleTextAreaChange = (event) => {
        setTextAreaValue(event.target.value);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && selectedImage.type.includes('image')) {
            setImage(selectedImage);

            const imageUrl = URL.createObjectURL(selectedImage);
            setImageUrl(imageUrl);
        } else {
            console.error('Invalid file type. Please select an image.');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (showTextContent && textAreaValue) {
            const activeDotValue = document.querySelector(".textStoryWindow").className.split(" ").find((className) => colors.includes(className));

            db.collection("Reels").add({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                text: textAreaValue.trim(),
                background: activeDotValue,
            });
            console.log("succesfull")

            // Reset state variables to clear the fields
            setTextAreaValue("");
            setActiveDot(colors[0]);
            setShowTextContent(false);
            setShowPhotoContent(false);
            setShowForText(false);
            setShowAddText(false);
            setShowForPhoto(false);
            setShowCards(true);
        }

        if (showPhotoContent && image) {
            const upload = storage.ref(`Images/Reels/${user.uid}/${image.name}`).put(image);

            upload.on(
                "state_changed",
                (snapshot) => {
                    // Handle progress or state changes if needed
                },
                (error) => {
                    console.error("Error uploading:", error);
                },
                () => {
                    // Upload completed successfully, get download URL
                    storage
                        .ref(`Images/Reels/${user.uid}`)
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            // Add data to Firestore or perform other actions
                            db.collection("Reels").add({
                                uid: user.uid,
                                email: user.email,
                                username: user.displayName,
                                photoURL: user.photoURL,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                text: textAreaValue.trim(),
                                background: url,
                            });

                            console.log("Successful");

                            // Reset state variables to clear the fields
                            setImage('');
                            setTextAreaValue("");
                            setActiveDot(colors[0]);
                            setShowTextContent(false);
                            setShowPhotoContent(false);
                            setShowForText(false);
                            setShowAddText(false);
                            setShowForPhoto(false);
                            setShowCards(true);
                        })
                        .catch((downloadError) => {
                            console.error("Error getting download URL:", downloadError);
                        });
                }
            );
        }
    };

    return (
        <div className="homepage_storyreels">
            <div className='homepage_storyreels_Leftbar'>
                <div className='homepage_storyreels_Leftbar_Top'>
                    <div className='homepage_storyreels_Leftbar_TopTop'>
                        <div className="homepage_storyreels_Leftbar_TopTop_heading">
                            <p>Your story</p>
                            <SettingsIcon />
                        </div>
                        <div className="homepage_storyreels_Leftbar_TopTop_userinfo">
                            <img src={user.photoURL} alt="" />
                            <p>{user.displayName}</p>
                        </div>
                    </div>

                    <hr id='line' />

                    <div className="homepage_storyreels_Leftbar_TopBottom forText" style={{ display: showForText ? 'flex' : 'none' }}>
                        <textarea
                            rows="7"
                            placeholder='Start typing'
                            value={textAreaValue}
                            onChange={handleTextAreaChange}
                        ></textarea>

                        <select name="texts">
                            <option value="Simple">Simple</option>
                            <option value="Clean">Clean</option>
                            <option value="Causal">Causal</option>
                            <option value="Fancy">Fancy</option>
                            <option value="Headline">Headline</option>
                        </select>

                        <div className='bgColors'>
                            <p>Backgrounds</p>
                            <div className="bgColorsInner">
                                {colors.map((color) => (
                                    <div
                                        key={color}
                                        className={`dot ${color} ${activeDot === color ? 'active' : ''}`}
                                        onClick={() => handleDotClick(color)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p
                        id='showtextForphoto'
                        style={{ display: showAddText ? 'block' : 'none' }}
                        onClick={() => {
                            setShowForText(false);
                            setShowTextContent(false);
                            setShowAddText(true);
                            setShowForPhoto((prev) => !prev);
                            setShowPhotoContent(true);
                        }}
                    >
                        Add Text
                    </p>

                    <div className="homepage_storyreels_Leftbar_TopBottom forPhoto" style={{ display: showForPhoto ? 'flex' : 'none' }}>
                        <textarea
                            rows="7"
                            placeholder='Start typing'
                            value={textAreaValue}
                            onChange={handleTextAreaChange}
                        ></textarea>

                        <select name="texts">
                            <option value="Simple">Simple</option>
                            <option value="Clean">Clean</option>
                            <option value="Causal">Causal</option>
                            <option value="Fancy">Fancy</option>
                            <option value="Headline">Headline</option>
                        </select>
                    </div>
                </div>

                <div className="homepage_storyreels_Leftbar_Bottom">
                    <button id='discardBtn' onClick={handleDiscardClick}>Discard</button>
                    <button id='shareBtn' onClick={handleUpload}>Share to Story</button>
                </div>
            </div>

            <div className='homepage_storyreels_Main'>
                <div className="homepage_storyreels_Main_Body">
                    <div className="homepage_storyreels_Main_Body">
                        <div
                            className="homepage_storyreels_Main_BodyCard Photo"
                            style={{ display: showCards ? 'flex' : 'none' }}
                            onClick={handleAddPhotoClick}

                        >
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                            <p>Create a Photo Story</p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden-input"
                                ref={inputRef}
                            />
                        </div>
                        <div
                            className="homepage_storyreels_Main_BodyCard Text"
                            style={{ display: showCards ? 'flex' : 'none' }}
                            onClick={handleAddTextClick}
                        >
                            <TitleIcon />
                            <p>Create a Text Story</p>
                        </div>

                        {/* Conditional rendering of content div */}
                        {showTextContent || showPhotoContent ? (
                            <div className="contentDiv">
                                {showTextContent && (
                                    <div className="textStoryContent">
                                        <p>Preview</p>
                                        <div className="textStoryContent_Inner">
                                            <div className={`textStoryWindow ${activeDot}`}>
                                                <p>{textAreaValue}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Content for Photo Story */}
                                {showPhotoContent && (
                                    <div className="photoStoryContent">
                                        <p>Peview</p>
                                        <div className="photoStoryContent_Inner">
                                            <div className="photoStoryWindow" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}>
                                                {image && console.log(imageUrl)}
                                                <p>{textAreaValue}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div >
        </div >
    )
}

export default HomePage_StoryReels