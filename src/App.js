import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useStateValue } from "./Components/StateProvider";
import Login from "./Components/Login";
import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import RightSidebar from "./Components/RightSidebar";
import Feeds from "./Components/Feeds";
import HomePage from "./Components/HomePage";
import FriendsPage from './Components/FriendsPage';
import StartupPage from './Components/StartupPage';
import Signup from './Components/Signup';


function App() {
	const [{ user }, dispatch] = useStateValue();
	const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');
	// const navigate = useNavigate();

	const Home = () => {
		return (
			<>
				<LeftSidebar />
				<Feeds />
				<RightSidebar />
			</>
		);
	}

	return (
		<Router>
			<>
				{isUserLoggedOut ? (
					// navigate('/home')
					// <Navigate to="/home" />
					<StartupPage />
				) : !user ? (
					<div>
						<StartupPage />
						<div className="userAuths">
							<Routes>
								<Route path='login' element={<Login />} />
								<Route path='signup' element={<Signup />} />
							</Routes>
						</div>
					</div>
				) : (
					<div className="App">
						<Header />
						<div className="app_body">
							<Routes>
								<Route path="home" element={<Home />} />
								<Route path="userhomepage" element={<HomePage />} />
								<Route path="friendpage" element={<FriendsPage />} />
							</Routes>
						</div>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;