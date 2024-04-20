import '../../CSS/UserPage/UserpageComponentsPhotos.css'
import React from 'react';
import UserpagePhotos from './UserpagePhotos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function UserpageComponentsPhotos() {
    return (
        <div className="UserpageComponents_Photos">
            <div className="UserpageComponents_Photos_Top">
                <div className="UserpageComponents_Photos_TopLeft">
                    <h3>Photos</h3>
                </div>

                <div className="UserpageComponents_Photos_TopRight">
                    <p>Add photos</p>
                    <MoreHorizIcon className='moreOptions'/>
                </div>
            </div>

            <div className="UserpageComponents_Photos_Middle">
                <UserpagePhotos />
            </div>
        </div>
    )
}

export default UserpageComponentsPhotos;