import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from './Components/BackendRelated/StateProvider';
import Login from './Components/StartupPage/Login';
import Header from './Components/UniversalComponent/Header';
import FriendsPage from './Components/FriendsPage/FriendsPage';
import UserPage from './Components/UserPage/UserPage';
import FriendsPage_Leftbar_AllFriends from './Components/FriendsPage/FriendsPage_Leftbar_AllFriends';
import HomePage_StoryReels_Main from './Components/HomePage/HomePage_StoryReels_Main';
import HomePage from './Components/HomePage/HomePage';

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
							<Route path="homepage/storyreels" element={<HomePage_StoryReels_Main />} />
							<Route path="friendpage/*" element={<FriendsPage />} />
							<Route path="friendpage/allfriends" element={<FriendsPage_Leftbar_AllFriends />} />
							<Route path="userhomepage" element={<UserPage />} />
						</Routes>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;