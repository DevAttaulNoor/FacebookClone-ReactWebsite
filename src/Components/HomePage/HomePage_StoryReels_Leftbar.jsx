import '../../CSS/HomePage/HomePage_StoryReels_Leftbar.css'
import React, { useState } from 'react';
import { useStateValue } from '../BackendRelated/StateProvider';
import SettingsIcon from '@mui/icons-material/Settings';

function HomePage_StoryReels_Leftbar() {
    const [{ user }] = useStateValue()
    const [activeDot, setActiveDot] = useState(null); // Initialize activeDot state

    const colors = [
        'red', 'blue', 'green', 'black', 'brown', 'yellow', 'blueviolet',
        'cyan', 'gold', 'violet', 'silver', 'purple'
    ];

    const handleDotClick = (color) => {
        setActiveDot(color); // Update the activeDot state when a dot is clicked
    };

    return (
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

                <div className="homepage_storyreels_Leftbar_TopBottom forText">
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

                <div className="homepage_storyreels_Leftbar_TopBottom forPhoto">
                    <p>Add Text</p>

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
                <button id='discardBtn'>Discard</button>
                <button id='shareBtn'>Share to Story</button>
            </div>
        </div>
    )
}

export default HomePage_StoryReels_Leftbar