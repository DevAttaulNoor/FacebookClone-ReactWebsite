import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import Feeds from "./Components/Feeds";
import RightSidebar from "./Components/RightSidebar";
import Login from "./Components/Login";
import { useStateValue } from "./Components/StateProvider";

function App() {
	const [{ user }, dispatch] = useStateValue();
	
	return (
		<>
			{!user ? (<Login />)
				: (
					<div className="App">
						<Header />
						<div className="app_body">
							<LeftSidebar />
							<Feeds />
							<RightSidebar />
						</div>
					</div>
				)
			}
		</>
	);
}

export default App;