import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from './Components/BackendRelated/StateProvider';
import Login from './Components/StartupPage/Login';
import Header from './Components/UniversalComponent/Header';
import HomePage_Leftbar from './Components/HomePage/HomePage_Leftbar';
import HomePage_Rightbar from './Components/HomePage/HomePage_Rightbar';
import HomePage_Feeds from './Components/HomePage/HomePage_Feeds';
import FriendsPage from './Components/FriendsPage/FriendsPage';
import UserPage from './Components/UserPage/UserPage';

function App() {
	const [{ user }, dispatch] = useStateValue();

	const Home = () => {
		return (
			<>
				<HomePage_Leftbar />
				<HomePage_Feeds />
				<HomePage_Rightbar />
			</>
		);
	}

	return (
		<Router>
			<>
				{!user ? (
					<Login />
				) : (
					<div className="App">
						<Header />
						<div className="app_body">
							<Routes>
								<Route path="home" element={<Home />} />
								<Route path="friendpage/*" element={<FriendsPage />}/>
								<Route path="userhomepage" element={<UserPage />} />
							</Routes>
						</div>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;