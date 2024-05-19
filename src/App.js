import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setLoading } from './Redux/userSlice';
import { setSelectedFriend } from './Redux/friendSlice';
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
import ReelPage from './Components/HomePage/ReelPage';

function App() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.data.user.user);
	const loading = useSelector((state) => state.data.user.isLoading);

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
									<Route path="reelpage/*" element={<ReelPage />} />
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