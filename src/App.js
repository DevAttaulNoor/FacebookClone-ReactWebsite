import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Authentication from './Components/Authentication/Authentication';
import Header from './Components/UniversalComponent/Header';
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

function App() {
	const user = useSelector((state) => state.data.user.user);

	return (
		<Router>
			<>
				{!user ? (
					<Authentication/>
				) : (
					<div className="App">
						<Header />
						<Friends/>
						<Routes>
							<Route path="homepage/*" element={<HomePage />} />
							<Route path="homepage/storyreels" element={<HomepageReels />} />
							<Route path="friendpage/*" element={<FriendPage />} />
							<Route path="friendpage/allFriends/*" element={<FriendpageAllFriends />} />
							<Route path="savedpage/*" element={<SavedPage />} />
							<Route path="videospage/*" element={<VideosPage />} />
							<Route path="userhomepage/*" element={<UserPage />} />
							<Route path="profilepage/:selectedFriend/*" element={<ProfilePage />} />
							<Route path="profilepage/:selectedFriend/post/:postId" element={<PostPage/>} />
						</Routes>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;