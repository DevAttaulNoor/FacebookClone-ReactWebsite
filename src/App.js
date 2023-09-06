import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateValue } from "./Components/StateProvider";
import Login from "./Components/Login";
import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import RightSidebar from "./Components/RightSidebar";
import Feeds from "./Components/Feeds";
import HomePage from "./Components/HomePage";

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
								<Route path="/" element={<Home />} />
								{/* <Route path="feeds" element={<Feeds />} />
								<Route path="left-sidebar" element={<LeftSidebar />} />
								<Route path="right-sidebar" element={<RightSidebar />} /> */}
								<Route path="homepage" element={<HomePage />} />
							</Routes>
						</div>
					</div>
				)}
			</>
		</Router>
	);
}

export default App;