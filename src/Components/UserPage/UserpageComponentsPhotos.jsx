import '../../CSS/UserPage/UserpageComponentsPhotos.css'
import React from 'react';
import UserpagePhotos from './UserpagePhotos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function UserpageComponentsPhotos() {
    return (
        <div className="userpageComponentsPhotos">
            <div className="userpageComponentsPhotos_Top">
                <div className="userpageComponentsPhotos_TopLeft">
                    <h3>Photos</h3>
                </div>

                <div className="userpageComponentsPhotos_TopRight">
                    <p>Add photos</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="userpageComponentsPhotos_Middle">
                <UserpagePhotos />
            </div>
        </div>
    )
}

export default UserpageComponentsPhotos;