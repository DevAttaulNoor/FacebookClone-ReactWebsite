import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import Feeds from "./Components/Feeds";
import RightSidebar from "./Components/RightSidebar";

function App() {
  return (
    <div className="App">
      {/* Header */}
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
  );
}

export default App;