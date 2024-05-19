import '../../CSS/HomePage/HomepageReels.css'
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/firebase';
import SettingsIcon from '@mui/icons-material/Settings';

function HomepageReels() {
    const colors = ['blue', 'red', 'green', 'brown', 'yellow', 'blueviolet', 'cyan', 'gold', 'violet', 'silver', 'purple'];
    const fontStyles = ['Helvetica', 'Times New Roman', 'Courier New', 'Verdana'];
    const user = useSelector((state) => state.data.user.user);
    const [showCards, setShowCards] = useState(true);
    const [showAddText, setShowAddText] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState("");
    const [textAreaValueCount, setTextAreaValueCount] = useState(250);
    const [activeFontStyle, setActiveFontStyle] = useState(fontStyles[0]);
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

    const handleFontStyleChange = (fontStyle) => {
        setActiveFontStyle(fontStyle);
    };

    const handleTextAreaChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.length > 250) {
            event.preventDefault();
            event.target.setSelectionRange(0, 250);
        } else {
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

    const photoTimestampName = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        const resetState = () => {
            setImage('');
            setImageUrl('');
            setTextAreaValue('');
            setActiveDot(colors[0]);
            setShowCards(true);
            setShowForText(false);
            setShowAddText(false);
            setShowForPhoto(false);
            setShowTextContent(false);
            setShowPhotoContent(false);
            setTextAreaValueCount(250);
        };

        const addToReels = async (data) => {
            const reelsRef = db.collection("Reels");
            const userReelsQuery = reelsRef.where("uid", "==", user.uid);
            const userReelsSnapshot = await userReelsQuery.get();

            if (!userReelsSnapshot.empty) {
                const existingReelDoc = userReelsSnapshot.docs[0];
                const existingReelData = existingReelDoc.data();
                const updatedReels = [...existingReelData.reel, { ...data }];
                await existingReelDoc.ref.update({ reel: updatedReels });
            } else {
                await reelsRef.add({
                    uid: user.uid,
                    email: user.email,
                    username: user.username,
                    photoURL: user.photoURL,
                    timestamp: new Date(),
                    reel: [{ ...data }]
                });
            }
            resetState();
        };

        if (showTextContent && textAreaValue) {
            try {
                const textStoryDiv = document.querySelector(".textStoryWindow");
                const canvas = await html2canvas(textStoryDiv);
                const imgData = canvas.toDataURL('image/jpeg', 1);

                // Convert data URL to a Blob
                const response = await fetch(imgData);
                const blob = await response.blob();

                // Upload the image
                const imageRef = storage.ref(`Reels/${user.uid}/${photoTimestampName()}.jpg`);
                await imageRef.put(blob);
                const url = await imageRef.getDownloadURL();
                await addToReels({
                    background: url,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Error capturing or uploading text story image:", error);
            }
        }

        if (showPhotoContent && image && showForPhoto === false) {
            try {
                const imageRef = storage.ref(`Reels/${user.uid}/${image.name}`);
                await imageRef.put(image);
                const url = await imageRef.getDownloadURL();
                await addToReels({
                    background: url,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Error uploading or getting download URL:", error);
            }
        }

        if (showPhotoContent && image && showForPhoto === true) {
            try {
                const photoStoryDiv = document.querySelector(".photoStoryWindow");
                const canvas = await html2canvas(photoStoryDiv);
                const imgData = canvas.toDataURL('image/jpeg', 1);

                // Convert data URL to a Blob
                const response = await fetch(imgData);
                const blob = await response.blob();

                // Upload the image
                const imageRef = storage.ref(`Reels/${user.uid}/${photoTimestampName()}.jpg`);
                await imageRef.put(blob);
                const url = await imageRef.getDownloadURL();
                await addToReels({
                    background: url,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Error capturing or uploading photo story image:", error);
            }
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

                                <select name="fonts" onChange={(e) => handleFontStyleChange(e.target.value)}>
                                    {fontStyles.map((fontStyle) => (
                                        <option key={fontStyle} value={fontStyle}>{fontStyle}</option>
                                    ))}
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

                                    <select name="fonts" onChange={(e) => handleFontStyleChange(e.target.value)}>
                                        {fontStyles.map((fontStyle) => (
                                            <option key={fontStyle} value={fontStyle}>{fontStyle}</option>
                                        ))}
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
                                <p style={{ fontFamily: activeFontStyle }}>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}

                {showPhotoContent && (
                    <div className="photoReelContent">
                        <h5>Peview</h5>
                        <div className="photoReelContentInner">
                            <div className="photoStoryWindow" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}>
                                <p style={{ fontFamily: activeFontStyle }}>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomepageReels;