import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from './Components/BackendRelated/StateProvider';
import Login from './Components/StartupPage/Login';
import Header from './Components/UniversalComponent/Header';
import HomePage from './Components/HomePage/HomePage';
import UserPage from './Components/UserPage/UserPage';
import FriendsPage from './Components/FriendsPage/FriendsPage';
import FriendUserPage from './Components/FriendUserPage/FriendUserPage';
import FriendsPage_AllFriends from './Components/FriendsPage/FriendsPage_AllFriends';
import HomePage_StoryReels from './Components/HomePage/HomePage_StoryReels';

function App() {
	const [{ user }, dispatch] = useStateValue();

	return (
		<Router>
			<>
				{!user ? (
					<Login />
				) : (
					<div className="App">
						<Header />
						<Routes>
							<Route path="homepage/*" element={<HomePage />} />
							<Route path="homepage/storyreels" element={<HomePage_StoryReels />} />
							<Route path="friendpage/*" element={<FriendsPage />} />
							<Route path="friendpage/allFriends/*" element={<FriendsPage_AllFriends />} />
							<Route path="userhomepage" element={<UserPage />} />
							<Route path="frienduserpage/:friendUid" element={<FriendUserPage />} />
						</Routes>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;