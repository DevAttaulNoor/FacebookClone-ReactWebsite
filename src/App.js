import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setLoading } from './Redux/userSlice';
import { setSelectedFriend } from './Redux/friendSlice';
import Authentication from './Components/Authentication/Authentication';
import HeaderOption from './Components/Header/HeaderOption';
import Friends from './Components/UniversalComponent/Friends';
import HomePage from './Components/HomePage/HomePage';
import VideoPage from './Components/VideoPage/VideoPage';
import ReelCreate from './Components/ReelPage/ReelCreate';
import ReelPage from './Components/ReelPage/ReelPage';
import UserPage from './Components/UserPage/UserPage';
import PostPage from './Components/PostPage/PostPage';
import SavedPage from './Components/UniversalComponent/SavedPage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import FriendPage from './Components/FriendPage/FriendPage';
import FriendpageAllFriends from './Components/FriendPage/FriendpageAllFriends';
import LoadingLine from './Components/UniversalComponent/LoadingLine';
import BookmarkPage from './Components/UniversalComponent/BookmarkPage';

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
						{user && <HeaderOption />}
						{user && <Friends />}
						<Routes>
							{user ? (
								<>
									<Route path="/" element={<Navigate to="/homepage" />} />
									<Route path="homepage/*" element={<HomePage />} />
									<Route path="homepage/storyreels" element={<ReelCreate />} />
									<Route path="friendpage/*" element={<FriendPage />} />
									<Route path="friendpage/allFriends/*" element={<FriendpageAllFriends />} />
									<Route path="savedpage/*" element={<SavedPage />} />
									<Route path="videopage/*" element={<VideoPage />} />
									<Route path="bookmarkpage/*" element={<BookmarkPage />} />
									<Route path="userhomepage/*" element={<UserPage />} />
									<Route path="reelpage/*" element={<ReelPage />} />
									<Route path="profilepage/:selectedFriend/*" element={<ProfilePage />} />
									<Route path="profilepage/:selectedFriend/post/:postId" element={<PostPage />} />
								</>
							) : (
								<>
									<Route path="/" element={<Authentication />} />
									<Route path="*" element={<Navigate to="/" />} />
								</>
							)}
						</Routes>
					</>
				)}
			</>
		</Router>
	);
}

export default App;