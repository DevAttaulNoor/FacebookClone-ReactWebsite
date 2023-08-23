import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import Feeds from "./Components/Feeds";
import RightSidebar from "./Components/RightSidebar";
import Login from "./Components/Login";
import { useStateValue } from "./Components/StateProvider";

function App() {
	const [{user}, dispatch] = useStateValue();
	console.log(user)

	return (
		<>
			{
				!user ? (<Login />) : (
					<div className="App">
						<Header />

						<div className="app_body">
							<LeftSidebar />
							<Feeds />
							<RightSidebar />
						</div>

						{/* Body */}
						{/* Left Sidebar */}
						{/* Posts */}
						{/* Right Sidebar */}
					</div>
				)
			}
		</>
	);
}

export default App;