import "../../CSS/UserPage/UserPage_Photos.css";
import cover from "../../Imgs/Cover.jpg";
import React from 'react';

function UserPage_Photos() {
    return (
        <div className='userpage_Photos'>
            <div className="userpage_Photos_top">
                <h2>Photos</h2>
                <a href="#">See all photos</a>
            </div>
            <div className="userpage_Photos_bottom">
                <div className="grid-container">
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                    <img src={cover} alt="" />
                </div>
            </div>
        </div>
    );
}

export default UserPage_Photos;