import React from 'react'
import cover from "../Imgs/Cover.jpg";
import "../CSS/HomePageFriends.css"

function HomePageFriends() {
    return (
        <div className='homepageFriends'>
            <div className="homepageFriends_top">
                <h2>Friends</h2>
                <a href="#">See all friends</a>
            </div>

            <div className="homepageFriends_bottom">
                <div className="grid-container">
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageFriends