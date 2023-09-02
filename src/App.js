import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import Feeds from "./Components/Feeds";
import RightSidebar from "./Components/RightSidebar";
import Login from "./Components/Login";
import { useStateValue } from "./Components/StateProvider";
import { useEffect } from "react";
import { auth } from "./Components/Firebase";

function App() {
	const [{ user }, dispatch] = useStateValue();
	console.log(user)

	// useEffect(() => {
	// 	// Listen for changes in authentication state
	// 	const unsubscribe = auth.onAuthStateChanged((authUser) => {
	// 	  if (authUser) {
	// 		// User is signed in
	// 		dispatch({
	// 		  type: 'SET_USER',
	// 		  user: {
	// 			displayName: authUser.displayName,
	// 			photoURL: authUser.photoURL,
	// 		  },
	// 		});
	// 	  } else {
	// 		// User is signed out
	// 		dispatch({
	// 		  type: 'SET_USER',
	// 		  user: null,
	// 		});
	// 	  }
	// 	});
	
	// 	return () => {
	// 	  // Clean up the listener when the component unmounts
	// 	  unsubscribe();
	// 	};
	//   }, [dispatch]);

	return (
		<>
			{
				!user ? (<Login />)
					: (
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