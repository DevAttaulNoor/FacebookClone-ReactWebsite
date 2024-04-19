import '../../CSS/UserPage/UserPage_Info.css';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import firebase from "firebase/compat/app";
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { db } from '../../Firebase/firebase';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';

function UserPage_Info() {
    Modal.setAppElement('#root');
    const user = useSelector((state) => state.data.user.user);
    const [bioText, setBioText] = useState('');
    const [isBioSectionVisible, setIsBioSectionVisible] = useState(false);
    const [isdetailsModalOpen, setIsdetailsModalOpen] = useState(false);
    const [ishobbiesModalOpen, setIshobbiesModalOpen] = useState(false);
    const [isfeatureModalOpen, setIsfeatureModalOpen] = useState(false);
    const [activeOptions, setActiveOptions] = useState([]);

    const toggleBioSection = () => {
        if (isBioSectionVisible) {
            setBioText('');
        } else {
            setBioText(bioText);
        }
        setIsBioSectionVisible(!isBioSectionVisible);
    };

    const saveBioText = () => {
        setIsBioSectionVisible(false);

        db.collection("Users")
            .doc(user.uid)
            .collection("Intro")
            .doc(user.uid)
            .set({
                introText: bioText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
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

    useEffect(() => {
        const docRef = db.collection("Users")
            .doc(user.uid)
            .collection("Intro")
            .doc(user.uid);

        const unsubscribe = docRef.onSnapshot((doc) => {
            if (doc.exists) {
                setBioText(doc.data().introText);
            } 
            
            else {
                console.log("No such document!");
                setBioText('');
            }
        });

        // Cleanup the subscription when the component is unmounted
        return () => unsubscribe();
    }, [user.uid]);

    useEffect(() => {
        if (isdetailsModalOpen || ishobbiesModalOpen || isfeatureModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        // Cleanup function to remove the class when the component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isdetailsModalOpen, ishobbiesModalOpen, isfeatureModalOpen]);

    return (
        <div className='userpageInfo'>
            <NavLink id="navLink" to="/userhomepage/about" activeclassname="active">
                <h3>Intro</h3>
            </NavLink>

            <div className="bioSection">
                {isBioSectionVisible ? (
                    <div className="bioSection_Top" style={{ display: 'flex' }}>
                        <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} placeholder='Describe who you are'></textarea>
                    </div>
                ) : (
                    <p className="savedBioText" style={{ display: bioText ? 'block' : 'none' }}>
                        {bioText}
                    </p>
                )}

                <div className="bioSection_Bottom" style={{ display: isBioSectionVisible ? 'flex' : 'none' }}>
                    <div className="bioSection_BottomLeft">
                        <PublicIcon />
                        <p>Public</p>
                    </div>
                    <div className="bioSection_BottomRight">
                        <button id="cancelBtn" onClick={() => setIsBioSectionVisible(false)}>Cancel</button>
                        <button id="saveBtn" onClick={saveBioText}>Save</button>
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
                <Modal className="detailsModal" isOpen={isdetailsModalOpen} onRequestClose={() => setIsdetailsModalOpen(false)}>
                    <div className="detailsModal_Top">
                        <CloseIcon onClick={() => setIsdetailsModalOpen(false)} />
                        <p>Edit details</p>
                    </div>

                    <div className="detailsModal_Middle">
                        <div className='detailsModal_MiddleHeading'>
                            <h3>Customise your Intro</h3>
                            <p>Details you select will be public.</p>
                        </div>

                        <div className='detailsModal_MiddleOption'>
                            <h3>Work</h3>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add a workplace</p>
                            </div>
                        </div>

                        <div className='detailsModal_MiddleOption'>
                            <h3>Education</h3>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add secondary school</p>
                            </div>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add university</p>
                            </div>
                        </div>

                        <div className='detailsModal_MiddleOption'>
                            <h3>Current town/city</h3>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add current city</p>
                            </div>
                        </div>

                        <div className='detailsModal_MiddleOption'>
                            <h3>Home town</h3>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add home town</p>
                            </div>
                        </div>

                        <div className='detailsModal_MiddleOption'>
                            <h3>Relationship</h3>
                            <div className='detailsModal_MiddleOptionInner'>
                                <AddIcon />
                                <p>Add a relationship status</p>
                            </div>
                        </div>

                        <div className='detailsModal_MiddleNote'>
                            <div className='detailsModal_MiddleNote_Left'>
                                <h3>Websites</h3>
                                <p>To feature links on your Profile, set the audience to <span>Public.</span></p>
                            </div>
                            <button className='detailsModal_MiddleNote_Right'>
                                <PublicIcon />
                                <p>Public</p>
                            </button>
                        </div>

                        <div className='detailsModal_MiddleNote'>
                            <div className='detailsModal_MiddleNote_Left'>
                                <h3>Social links</h3>
                                <p>To feature links on your Profile, set the audience to <span>Public.</span></p>
                            </div>
                            <button className='detailsModal_MiddleNote_Right'>
                                <PublicIcon />
                                <p>Public</p>
                            </button>
                        </div>
                    </div>

                    <div className="detailsModal_Bottom">
                        <p>Update your information</p>
                        <div className='detailsModal_Bottom_Right'>
                            <button onClick={() => setIsdetailsModalOpen(false)}>Cancel</button>
                            <button id='saveBtn'>Save</button>
                        </div>
                    </div>
                </Modal>
                <button onClick={() => setIsdetailsModalOpen(true)}>Edit Details</button>
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
                        <CloseIcon onClick={() => setIsfeatureModalOpen(false)} />
                        <p>Edit Featured</p>
                    </div>

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