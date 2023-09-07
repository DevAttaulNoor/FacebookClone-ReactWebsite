import React from 'react';
import cover from "../Imgs/Cover.jpg";
import "../CSS/HomePagePhotos.css";

function HomePagePhotos() {
    return (
        <div className='homepagePhotos'>
            <div className="homepagePhotos_top">
                <h2>Photos</h2>
                <a href="#">See all photos</a>
            </div>

            <div className="homepagePhotos_bottom">
                <div className="grid-container">
                    {/* Repeat this block for each image */}
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

export default HomePagePhotos;
