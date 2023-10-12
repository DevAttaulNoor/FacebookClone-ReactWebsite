import '../../CSS/UserPage/UserPage_Info.css';
import React, { useState } from 'react';
import Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';

function UserPage_Info() {
    Modal.setAppElement('#root');

    const [bioText, setBioText] = useState('');
    const [savedBioText, setSavedBioText] = useState('');
    const [isBioSectionVisible, setIsBioSectionVisible] = useState(false);
    const [ishobbiesModalOpen, setIshobbiesModalOpen] = useState(false);
    const [isfeatureModalOpen, setIsfeatureModalOpen] = useState(false);
    const [activeOptions, setActiveOptions] = useState([]);

    const toggleBioSection = () => {
        if (isBioSectionVisible) {
            setBioText('');
        } else {
            setBioText(savedBioText);
        }
        setIsBioSectionVisible(!isBioSectionVisible);
    };

    const saveBioText = () => {
        setSavedBioText(bioText);
        setIsBioSectionVisible(false);
    };

    const toggleOption = (option) => {
        if (activeOptions.includes(option)) {
            setActiveOptions(activeOptions.filter((item) => item !== option));
        } else {
            setActiveOptions([...activeOptions, option]);
        }
    };

    const isOptionActive = (option) => {
        return activeOptions.includes(option) ? 'activeOption' : '';
    };

    return (
        <div className='userpage_Info'>
            <h2>Intro</h2>

            <div className="bioSection">
                {isBioSectionVisible ? (
                    <div className="bioSection_Top" style={{ display: 'flex' }}>
                        <textarea value={bioText} onChange={(e) => setBioText(e.target.value)}></textarea>
                    </div>
                ) : (
                    <p className="savedBioText" style={{ display: savedBioText ? 'block' : 'none' }}>
                        {savedBioText}
                    </p>
                )}

                <div className="bioSection_Bottom" style={{ display: isBioSectionVisible ? 'flex' : 'none' }}>
                    <div className="bioSection_BottomLeft">
                        <PublicIcon />
                        <p>Public</p>
                    </div>
                    <div className="bioSection_BottomRight">
                        <button id="cancelBtn" onClick={() => setIsBioSectionVisible(false) }>
                            Cancel
                        </button>
                        <button id="saveBtn" onClick={saveBioText}>
                            Save
                        </button>
                    </div>
                </div>

                {isBioSectionVisible ? (
                    <button onClick={toggleBioSection}>Cancel</button>
                ) : bioText ? (
                    <button onClick={toggleBioSection}>Edit bio</button>
                ) : (
                    <button onClick={toggleBioSection}>Add bio</button>
                )}
            </div>

            <div className='detailsSection'>
                <Modal>
                </Modal>
                <button>Edit Details</button>
            </div>

            <div className='hobbieSection'>
                <Modal className="hobbiesModal" isOpen={ishobbiesModalOpen} onRequestClose={() => setIshobbiesModalOpen(false)}>
                    <div className="hobbiesModal_Top">
                        <CloseIcon onClick={() => setIshobbiesModalOpen(false)} />
                        <div className='hobbiesModal_TopImg'>
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/0DqfQD96F8w.png" alt="" />
                        </div>
                        <div className='hobbiesModal_TopIntro'>
                            <h2>Add Hobbies</h2>
                            <p>What do you love to do? Choose from the popular hobbies below or add others.</p>
                        </div>
                    </div>

                    <hr />

                    <div className="hobbiesModal_Middle">
                        <p id='hobbiesModal_MiddleIntro'>Recommended Hobbies</p>
                        <div className="hobbiesModal_MiddleOptions">
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Travelling')}`} onClick={() => toggleOption('Travelling')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🌏</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Travelling</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Reading')}`} onClick={() => toggleOption('Reading')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>📖</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Reading</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Going to the gym')}`} onClick={() => toggleOption('Going to the gym')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>👟</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Going to the gym</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Listening to music')}`} onClick={() => toggleOption('Listening to music')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🎧</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Listening to music</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Investments')}`} onClick={() => toggleOption('Investments')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>📈</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Investments</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Video Games')}`} onClick={() => toggleOption('Video Games')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🎮</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Video Games</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Cricket')}`} onClick={() => toggleOption('Cricket')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🏏</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Cricket</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Eating')}`} onClick={() => toggleOption('Eating')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🍕️</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Eating</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Golf')}`} onClick={() => toggleOption('Golf')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>⛳</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Golf</p>
                            </div>
                            <div className={`hobbiesModal_MiddleOption ${isOptionActive('Driving')}`} onClick={() => toggleOption('Driving')}>
                                <p className='hobbiesModal_MiddleOptionIcon'>🚗</p>
                                <p className='hobbiesModal_MiddleOptionInfo'>Driving</p>
                            </div>
                        </div>
                        <div className='searchSection'>
                            <SearchIcon />
                            <p>Search for others</p>
                        </div>
                    </div>

                    <hr />

                    <div className="hobbiesModal_Bottom">
                        <div className="hobbiesModal_Bottom_Left">
                            <PublicIcon />
                            <p>Hobbies are public</p>
                        </div>

                        {activeOptions.length > 0 && (
                            <div className="hobbiesModal_Bottom_Right">
                                <button id='cancelBtn'>Cancel</button>
                                <button id='saveBtn'>Save</button>
                            </div>
                        )}
                    </div>
                </Modal>
                <button onClick={() => setIshobbiesModalOpen(true)}>Add hobbies</button>
            </div>

            <div className='featuredSection'>
                <Modal className="featuredModal" isOpen={isfeatureModalOpen} onRequestClose={() => setIsfeatureModalOpen(false)}>
                    <div className="featuredModal_Top">
                        <CloseIcon onClick={() => setIshobbiesModalOpen(false)} />
                        <p>Edit Featured</p>
                    </div>

                    <hr />

                    <div className="featuredModal_Middle">
                        <div className="imgSection">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/gL1slwup025.png" alt="" />
                        </div>
                        <p>Feature your favourite photos and stories here for all of your friends to see.</p>
                    </div>

                    <div className="featuredModal_Bottom">
                        <button id='addBtn'>Add New</button>
                    </div>
                </Modal>
                <button onClick={() => setIsfeatureModalOpen(true)}>Add featured</button>
            </div>
        </div >
    )
}

export default UserPage_Info