import '../../CSS/HomePage/HomePage_Messages.css'
import React from 'react'
import Modal from 'react-modal';

function HomePage_Messages(props) {
    Modal.setAppElement('#root');

    return (
        <div className='HomePage_Messages'>
            <Modal isOpen={props.isOpen} onRequestClose={props.onRequestClose}>
                <h2>New Message</h2>
            </Modal>
        </div>
    )
}

export default HomePage_Messages