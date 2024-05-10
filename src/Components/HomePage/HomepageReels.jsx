import '../../CSS/HomePage/HomepageReels.css'
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import firebase from "firebase/compat/app";
import SettingsIcon from '@mui/icons-material/Settings';

function HomepageReels() {
    const colors = ['blue', 'red', 'green', 'black', 'brown', 'yellow', 'blueviolet', 'cyan', 'gold', 'violet', 'silver', 'purple'];
    const user = useSelector((state) => state.data.user.user);
    const [showCards, setShowCards] = useState(true);
    const [showAddText, setShowAddText] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState("");
    const [textAreaValueCount, setTextAreaValueCount] = useState(250);
    const [showTextContent, setShowTextContent] = useState(false);
    const [showForText, setShowForText] = useState(false);
    const [activeDot, setActiveDot] = useState(colors[0]);
    const [showPhotoContent, setShowPhotoContent] = useState(false);
    const [showForPhoto, setShowForPhoto] = useState(false);
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const inputRef = useRef(null);

    const handleDotClick = (color) => {
        setActiveDot(color);
    };

    const handleTextAreaChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.length > 250) {
            console.log("Length Exceeds 10");
            event.preventDefault();
            event.target.setSelectionRange(0, 250);
        } else {
            console.log("Length within 10");
            setTextAreaValue(inputValue);
            setTextAreaValueCount(250 - inputValue.length)
        }
    };

    const handleAddTextClick = () => {
        setShowForText(true);
        setShowTextContent(true);
        setShowAddText(false);
        setShowForPhoto(false);
        setShowPhotoContent(false);
        setShowCards(false);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && selectedImage.type.includes('image')) {
            setImage(selectedImage);

            const imageUrl = URL.createObjectURL(selectedImage);
            setImageUrl(imageUrl);
            setShowForText(false);
            setShowTextContent(false);
            setShowAddText(true);
            setShowForPhoto(false);
            setShowPhotoContent(true);
            setShowCards(false);
        } else {
            console.error('Invalid file type. Please select an image.');
        }
    };

    const handleTextInPhoto = () => {
        setShowForText(false);
        setShowTextContent(false);
        setShowAddText(true);
        setShowForPhoto((prev) => !prev);
        setShowPhotoContent(true);
    };

    const handleDiscardClick = () => {
        setTextAreaValue("");
        setImage('');
        setImageUrl('');
        setActiveDot(colors[0]);
        setShowForText(false);
        setShowTextContent(false);
        setShowForPhoto(false);
        setShowPhotoContent(false);
        setShowAddText(false);
        setShowCards(true);
        setTextAreaValueCount(250);

        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (showTextContent && textAreaValue) {
            const activeDotValue = document.querySelector(".textStoryWindow").className.split(" ").find((className) => colors.includes(className));

            db.collection("Reels").add({
                uid: user.uid,
                email: user.email,
                username: user.username,
                photoURL: user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                text: textAreaValue.trim(),
                background: activeDotValue,
            });

            // Reset state variables to clear the fields
            setTextAreaValue("");
            setActiveDot(colors[0]);
            setShowTextContent(false);
            setShowPhotoContent(false);
            setShowForText(false);
            setShowAddText(false);
            setShowForPhoto(false);
            setShowCards(true);
            setTextAreaValueCount(250);
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
                                username: user.username,
                                photoURL: user.photoURL,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                text: textAreaValue.trim(),
                                background: url,
                            });

                            // Reset state variables to clear the fields
                            setImage('');
                            setImageUrl('');
                            setTextAreaValue("");
                            setActiveDot(colors[0]);
                            setShowTextContent(false);
                            setShowPhotoContent(false);
                            setShowForText(false);
                            setShowAddText(false);
                            setShowForPhoto(false);
                            setShowCards(true);
                            setTextAreaValueCount(250);
                        })
                        .catch((downloadError) => {
                            console.error("Error getting download URL:", downloadError);
                        });
                }
            );
        }
    };

    return (
        <div className="homepageReels">
            <div className='homepageReelsLeftbar'>
                <div>
                    <div className='homepageReelsLeftbar_Top'>
                        <div className="homepageReelsLeftbar_TopHeading">
                            <p>Your story</p>
                            <SettingsIcon />
                        </div>

                        <div className="homepageReelsLeftbar_TopUserinfo">
                            <img src={user.photoURL} alt="" />
                            <p>{user.username}</p>
                        </div>
                    </div>

                    <div className="homepageReelsLeftbar_Middle">
                        {showForText && (
                            <div className='textReelContainer'>
                                <textarea
                                    rows="7"
                                    placeholder='Start typing'
                                    value={textAreaValue}
                                    onChange={handleTextAreaChange}
                                ></textarea>

                                <p id='limitNote'>{textAreaValueCount} charcters remaining</p>

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
                        )}

                        <div className='photoReelContainer'>
                            {showAddText && (
                                <div className='textInPhotoReel' onClick={handleTextInPhoto}>
                                    <p>Add Text</p>
                                </div>
                            )}

                            {showForPhoto && (
                                <div className='photoReel'>
                                    <textarea
                                        rows="7"
                                        placeholder='Start typing'
                                        value={textAreaValue}
                                        onChange={handleTextAreaChange}
                                    ></textarea>

                                    <p id='limitNote'>{textAreaValueCount} charcters remaining</p>

                                    <select name="texts">
                                        <option value="Simple">Simple</option>
                                        <option value="Clean">Clean</option>
                                        <option value="Causal">Causal</option>
                                        <option value="Fancy">Fancy</option>
                                        <option value="Headline">Headline</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {(showTextContent || showPhotoContent) && (
                    <div className="homepageReelsLeftbar_Bottom">
                        <button id='discardBtn' onClick={handleDiscardClick}>Discard</button>
                        <button id='shareBtn' onClick={handleUpload}>Share to Story</button>
                    </div>
                )}
            </div>

            <div className='homepageReelsMain'>
                {showCards && (
                    <div className='homepageReelsMainCards'>
                        <div className="cardContainer photoCard" onClick={() => inputRef.current.click()}>
                            <div className='icon'>
                                <i></i>
                            </div>
                            <p>Create a Photo Story</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hiddenInput"
                                ref={inputRef}
                            />
                        </div>

                        <div className="cardContainer textCard" onClick={handleAddTextClick}>
                            <div className='icon'>
                                <i></i>
                            </div>
                            <p>Create a Text Story</p>
                        </div>
                    </div>
                )}

                {showTextContent && (
                    <div className="textReelContent">
                        <h5>Preview</h5>
                        <div className="textReelContentInner">
                            <div className={`textStoryWindow ${activeDot}`}>
                                <p>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}

                {showPhotoContent && (
                    <div className="photoReelContent">
                        <h5>Peview</h5>
                        <div className="photoReelContentInner">
                            <div className="photoStoryWindow" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}>
                                <p>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default HomepageReels;