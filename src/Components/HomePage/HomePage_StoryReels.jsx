import '../../CSS/HomePage/HomePage_StoryReels.css'
import React, { useState } from 'react';
import { useStateValue } from '../BackendRelated/StateProvider';
import TitleIcon from '@mui/icons-material/Title';
import SettingsIcon from '@mui/icons-material/Settings';

function HomePage_StoryReels() {
    const [{ user }] = useStateValue()
    const [activeDot, setActiveDot] = useState(null);
    const [showForText, setShowForText] = useState(false);
    const [showTextContent, setShowTextContent] = useState(false);
    const [showForPhoto, setShowForPhoto] = useState(false);
    const [showPhotoContent, setShowPhotoContent] = useState(false);
    const [showAddText, setShowAddText] = useState(false);
    const [showCards, setShowCards] = useState(true);


    const colors = ['red', 'blue', 'green', 'black', 'brown', 'yellow', 'blueviolet', 'cyan', 'gold', 'violet', 'silver', 'purple'];

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
    };

    const handleDiscardClick = () => {
        setShowForText(false);
        setShowTextContent(false);
        setShowForPhoto(false);
        setShowPhotoContent(false);
        setShowAddText(false);
        setShowCards(true);
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
                        <textarea rows="7" m placeholder='Start typing'></textarea>

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
                            setShowForPhoto((prev) => !prev); // Toggle showForPhoto
                            setShowPhotoContent(true);
                        }}
                    >
                        Add Text
                    </p>

                    <div className="homepage_storyreels_Leftbar_TopBottom forPhoto" style={{ display: showForPhoto ? 'flex' : 'none' }}>
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
                </div>

                <div className="homepage_storyreels_Leftbar_Bottom">
                    <button id='discardBtn' onClick={handleDiscardClick}>Discard</button>
                    <button id='shareBtn'>Share to Story</button>
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
                                {/* Content for Text Story */}
                                {showTextContent && (
                                    <div className="textStoryContent">
                                        {/* Add your text story content here */}
                                        Text content
                                    </div>
                                )}

                                {/* Content for Photo Story */}
                                {showPhotoContent && (
                                    <div className="photoStoryContent">
                                        {/* Add your photo story content here */}
                                        Photo content
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