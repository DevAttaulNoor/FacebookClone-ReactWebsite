import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
				<StartupPage />

				{!user ? (
					<div>
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
								<Route path="/" element={<Home />} />
								<Route path="homepage" element={<HomePage />} />
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