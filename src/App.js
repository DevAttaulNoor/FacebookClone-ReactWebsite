import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from "./Components/StateProvider";
import Login from "./Components/Login";
import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import RightSidebar from "./Components/RightSidebar";
import Feeds from "./Components/Feeds";
import HomePage from "./Components/HomePage";
import FriendsPage from './Components/FriendsPage';

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
				{!user ? (
					<Login />
				) : (
					<div className="App">
						<Header />
						<div className="app_body">
							<Routes>
								<Route path="home" element={<Home />} />
								<Route path="friendpage" element={<FriendsPage />} />
								<Route path="userhomepage" element={<HomePage />} />
							</Routes>
						</div>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;