import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from './Components/BackendRelated/StateProvider';
import Login from './Components/StartupPage/Login';
import Header from './Components/UniversalComponent/Header';
import HomePage from './Components/HomePage/HomePage';
import HomePage_StoryReels from './Components/HomePage/HomePage_StoryReels';
import UserPage from './Components/UserPage/UserPage';
import SavedPage from './Components/SavedPage/SavedPage';
import VideosPage from './Components/VideosPage/VideosPage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import FriendsPage from './Components/FriendsPage/FriendsPage';
import FriendsPage_AllFriends from './Components/FriendsPage/FriendsPage_AllFriends';
import PostPage from './Components/UniversalComponent/PostPage';

function App() {
	const [{ user }] = useStateValue();

	return (
		<Router>
			<>
				{!user ? (
					<Routes>
						<Route path='/' element={<Login />} />
					</Routes>
				) : (
					<div className="App">
						<Header />
						<Routes>
							<Route path="homepage/*" element={<HomePage />} />
							<Route path="homepage/storyreels" element={<HomePage_StoryReels />} />
							<Route path="friendpage/*" element={<FriendsPage />} />
							<Route path="friendpage/allFriends/*" element={<FriendsPage_AllFriends />} />
							<Route path="savedpage/*" element={<SavedPage />} />
							<Route path="videospage/*" element={<VideosPage />} />
							<Route path="userhomepage/*" element={<UserPage />} />
							<Route path="profilepage/:userid/*" element={<ProfilePage />} />
							<Route path="profilepage/:userid/post/*" element={<PostPage />} />
						</Routes>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;