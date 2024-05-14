import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setLoading } from './Redux/userSlice';
import { db } from './Firebase/firebase';
import { setSelectedFriend } from './Redux/friendSlice';
import { setChatNotification, setNotification } from './Redux/notificationSlice';
import Authentication from './Components/Authentication/Authentication';
import HeaderOption from './Components/Header/HeaderOption';
import Friends from './Components/UniversalComponent/Friends';
import HomePage from './Components/HomePage/HomePage';
import HomepageReels from './Components/HomePage/HomepageReels';
import UserPage from './Components/UserPage/UserPage';
import SavedPage from './Components/UniversalComponent/SavedPage';
import VideosPage from './Components/UniversalComponent/VideosPage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import FriendPage from './Components/FriendPage/FriendPage';
import FriendpageAllFriends from './Components/FriendPage/FriendpageAllFriends';
import PostPage from './Components/UniversalComponent/PostPage';
import LoadingLine from './Components/UniversalComponent/LoadingLine';

function App() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.data.user.user);
	const loading = useSelector((state) => state.data.user.isLoading);
	const [chats, setChats] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await db.collection('Chats').get();
	
				if (!querySnapshot.empty) {
					const chatsData = [];
	
					querySnapshot.forEach(doc => {
						const chatData = doc.data();
						const messagesData = chatData.messages || [];
						chatData.messages = messagesData;
						chatsData.push(chatData);
					});
	
					setChats(chatsData);
	
					const relevantChats = chatsData
						.map(chat => (chat.recipientUid === user.uid || chat.senderUid === user.uid) ? chat : null)
						.filter(Boolean);
	
					dispatch(setChatNotification(relevantChats));
				} else {
					setChats([]);
					dispatch(setChatNotification([]));
				}
			} catch (error) {
				console.error('Error fetching chat data:', error);
				setChats([]);
				dispatch(setChatNotification([]));
			}
		};
	
		fetchData();
	
	}, [chats, dispatch, user.uid]);

	useEffect(() => {
        const likesData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Likes');
        const commentData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('Comments');
        const friendReqData = db.collection('Users').doc(user.uid).collection('Notifications').doc(user.uid).collection('FriendsReqs');

        // Use Promise.all to wait for all promises to resolve
        Promise.all([
            likesData.get(),
            commentData.get(),
            friendReqData.get(),
        ]).then((results) => {
            const likes = results[0].docs.map((doc) => doc.data());
            const comments = results[1].docs.map((doc) => doc.data());
            const friendReqs = results[2].docs.map((doc) => doc.data());

            // Combine data from all collections
            const notification = [...likes, ...comments, ...friendReqs];

            // Sort the combined array based on timestamps in ascending order
            notification.sort((a, b) => b.timestamp - a.timestamp);
            dispatch(setNotification(notification))

        }).catch((error) => {
            console.error('Error fetching notifications:', error);
        });


    }, [user.uid, dispatch]);
	
	useEffect(() => {
		const userData = JSON.parse(sessionStorage.getItem('userData'));
		const selectedFriend = JSON.parse(sessionStorage.getItem('selectedFriend'));
		if (userData) {
			dispatch(loginUser(userData));
		}
		if (selectedFriend) {
			dispatch(setSelectedFriend(selectedFriend.friendUid));
		}
		dispatch(setLoading(false));
	}, [dispatch]);

	return (
		<Router>
			<>
				{loading ? (
					<LoadingLine />
				) : (
					<>
						{user ? (
							<div className="App">
								<HeaderOption />
								<Friends />
								<Routes>
									<Route path="homepage/*" element={<HomePage />} />
									<Route path="homepage/storyreels" element={<HomepageReels />} />
									<Route path="friendpage/*" element={<FriendPage />} />
									<Route path="friendpage/allFriends/*" element={<FriendpageAllFriends />} />
									<Route path="savedpage/*" element={<SavedPage />} />
									<Route path="videospage/*" element={<VideosPage />} />
									<Route path="userhomepage/*" element={<UserPage />} />
									<Route path="profilepage/:selectedFriend/*" element={<ProfilePage />} />
									<Route path="profilepage/:selectedFriend/post/:postId" element={<PostPage />} />
								</Routes>
							</div>
						) : (
							<Routes>
								<Route path="/" element={<Authentication />} />
							</Routes>
						)}
					</>
				)}
			</>
		</Router>
	);
}

export default App;