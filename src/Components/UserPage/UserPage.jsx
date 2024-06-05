import "../../CSS/UserPage/UserPage.css";
import React from "react";
import { Avatar } from "@mui/material";
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../../Redux/userSlice";
import { db, storage } from '../../Firebase/firebase';
import UserpageComponents from "./UserpageComponents";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function UserPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friendsData = useSelector((state) => state.data.friends.friendsData);

    const changeProfileImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const storageRef = storage.ref(`Users/${user.uid}/${file.name}`);
                const snapshot = await storageRef.put(file);
                const url = await snapshot.ref.getDownloadURL();

                // Update user's photoURL in "Users" collection
                await db.collection("Users").doc(user.uid).update({ photoURL: url });
                console.log("User's photoURL in Users collection updated successfully!");

                const updateBatch = (batch, snapshot, field) => {
                    snapshot.forEach((doc) => {
                        batch.update(doc.ref, field);
                    });
                };

                // Fetch all users and update notifications
                const allUsersSnapshot = await db.collection("Users").get();
                const userPromises = allUsersSnapshot.docs.map(async (userDoc) => {
                    const otherUserUid = userDoc.id;
                    if (otherUserUid === user.uid) return;

                    const commentsSnapshot = await db.collection("Users").doc(otherUserUid).collection("Notifications").doc(otherUserUid).collection("Comments").where('userid', '==', user.uid).get();
                    const likesSnapshot = await db.collection("Users").doc(otherUserUid).collection("Notifications").doc(otherUserUid).collection("Likes").where('userid', '==', user.uid).get();

                    const batch = db.batch();
                    updateBatch(batch, commentsSnapshot, { userphotoUrl: url });
                    updateBatch(batch, likesSnapshot, { userphotoUrl: url });
                    await batch.commit();
                    console.log(`User's Notification photoURL collections updated successfully for user ${otherUserUid}!`);
                });
                await Promise.all(userPromises);

                // Update user's photoURL in "Posts" collection
                const postsSnapshot = await db.collection("Posts").where('uid', '==', user.uid).get();
                const postsBatch = db.batch();
                updateBatch(postsBatch, postsSnapshot, { photoURL: url });
                await postsBatch.commit();
                console.log("User's photoURL in Posts collection updated successfully!");

                // Update user's photoURL in "Reels" collection
                const reelsSnapshot = await db.collection("Reels").where('uid', '==', user.uid).get();
                const reelsBatch = db.batch();
                updateBatch(reelsBatch, reelsSnapshot, { photoURL: url });
                await reelsBatch.commit();
                console.log("User's photoURL in Reels collection updated successfully!");

                // Update user's photoURL in subcollections of "Posts"
                const allPostsSnapshot = await db.collection("Posts").get();
                const subcollectionsPromises = allPostsSnapshot.docs.map(async (postDoc) => {
                    const postId = postDoc.id;

                    const postCommentsSnapshot = await db.collection("Posts").doc(postId).collection("comments").where('uid', '==', user.uid).get();
                    const postLikesSnapshot = await db.collection("Posts").doc(postId).collection("likes").where('uid', '==', user.uid).get();

                    const batch = db.batch();
                    updateBatch(batch, postCommentsSnapshot, { photoURL: url });
                    updateBatch(batch, postLikesSnapshot, { photoUrl: url });
                    await batch.commit();
                    console.log(`User's photoURL updated in Comments and Likes subcollections for post ${postId}!`);
                });
                await Promise.all(subcollectionsPromises);

                // Update user's photoURL in "Chats" collection
                const chatsSnapshot = await db.collection("Chats").where('senderUid', '==', user.uid).get();
                const recipientChatsSnapshot = await db.collection("Chats").where('recipientUid', '==', user.uid).get();

                const chatsBatch = db.batch();
                updateBatch(chatsBatch, chatsSnapshot, { senderPhotoUrl: url });
                updateBatch(chatsBatch, recipientChatsSnapshot, { recipientPhotoUrl: url });
                await chatsBatch.commit();
                console.log("User's photoURL in Chats collection updated successfully!");

                // Update user's photoURL in "friendRequests" subcollections
                const allUsersWithFriendRequests = await db.collection("Users").get();
                const friendRequestsPromises = allUsersWithFriendRequests.docs.map(async (userDoc) => {
                    const friendRequestsSnapshot = await db.collection("Users").doc(userDoc.id).collection("friendRequests").where('senderUid', '==', user.uid).get();
                    const friendRequestsBatch = db.batch();
                    updateBatch(friendRequestsBatch, friendRequestsSnapshot, { senderPhotoUrl: url });
                    await friendRequestsBatch.commit();
                    console.log(`User's photoURL in friendRequests subcollection updated successfully for user ${userDoc.id}!`);
                });
                await Promise.all(friendRequestsPromises);

                // Update sessionStorage and Redux state
                const userDataString = sessionStorage.getItem('userData');
                let userData = userDataString ? JSON.parse(userDataString) : {};
                userData.photoURL = url;

                dispatch(loginUser(userData));
                sessionStorage.setItem('userData', JSON.stringify(userData));
            } catch (error) {
                console.error("Error updating user's photoURL: ", error);
            }
        }
    };

    const changeCoverImage = (e) => {
        const coverfile = e.target.files[0];
        if (coverfile) {
            const storageRef = storage.ref(`Users/${user.uid}/${coverfile.name}`);

            storageRef.put(coverfile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {

                    db.collection("Users").doc(user.uid).update({
                        coverphotoUrl: url
                    }).then(() => {
                        console.log("User's coverphotoUrl updated successfully!");

                        // Retrieve the existing userData from sessionStorage
                        const userDataString = sessionStorage.getItem('userData');
                        let userData = [];

                        if (userDataString) {
                            userData = JSON.parse(userDataString);
                        }

                        userData.coverphotoUrl = url;
                        dispatch(loginUser(userData))
                        sessionStorage.setItem('userData', JSON.stringify(userData));

                    }).catch((error) => {
                        console.error("Error updating user's coverphotoUrl: ", error);
                    });
                });
            });
        }
    };

    return (
        <div className="userpage">
            <div className="userpageTop">
                <div className="userpageTop_CoverSection">
                    <div className="coverImg">
                        <img src={user.coverphotoUrl} alt="coverPhoto" />

                        <div className="changeCoverPhoto" onClick={() => document.getElementById('coverImageInput').click()}>
                            <PhotoCameraIcon />
                            <p>Edit cover photo</p>
                        </div>

                        <input
                            type="file"
                            id="coverImageInput"
                            accept="image/*"
                            onChange={changeCoverImage}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <div className="userpageTop_ProfileSection">
                    <div className="userpageTop_ProfileSectionLeft">
                        <div className="profilePhoto">
                            <Avatar src={user.photoURL} />
                            <div onClick={() => document.getElementById('profileImageInput').click()}>
                                <PhotoCameraIcon className="profileChangeIcon" />
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={changeProfileImage}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="profileInfo">
                            <h3>{user.username}</h3>

                            <NavLink to="/userhomepage/friend">
                                <p>{friendsData.length} friends</p>
                            </NavLink>


                            <div className="friendsList">
                                {friendsData.slice(0, 8).map((friends, index) => (
                                    <NavLink to="/userhomepage/friend" key={friends.friendUid}>
                                        <div className="friendPhoto" style={{ marginRight: index !== friendsData.slice(0, 2).length - 1 ? '-10px' : '0' }}>
                                            <Avatar src={friends.photoURL} />
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="userpageTop_ProfileSectionRight">
                        <div className="userpageTop_ProfileSectionRightOption" id="addStoryBtn">
                            <AddIcon />
                            <p>Add to story</p>
                        </div>

                        <div className="userpageTop_ProfileSectionRightOption" id="editProfileBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" alt="" />
                            <p>Edit profile</p>
                        </div>

                        <div className="userpageTop_ProfileSectionRightOption" id="arrowBtn">
                            <KeyboardArrowDownIcon />
                        </div>
                    </div>
                </div>

                <div className="userpageTop_Components">
                    <div className="userpageTop_ComponentsLeft">
                        <NavLink to='/userhomepage/post' activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Posts</div>
                        </NavLink>

                        <NavLink to="/userhomepage/about" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>About</div>
                        </NavLink>

                        <NavLink to="/userhomepage/friend" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Friends</div>
                        </NavLink>

                        <NavLink to="/userhomepage/photo" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Photos</div>
                        </NavLink>

                        <NavLink to="/userhomepage/video" activeclassname="active">
                            <div className='userpageTop_ComponentsLeftOption'>Videos</div>
                        </NavLink>

                        <div className="userpageTop_ComponentsLeftOption" id="moreOption">
                            <p>More</p>
                            <ArrowDropDownIcon />
                        </div>
                    </div>

                    <div className="userpageTop_ComponentsRight">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="userpageBottom">
                <UserpageComponents />
            </div>
        </div>
    );
}

export default UserPage;