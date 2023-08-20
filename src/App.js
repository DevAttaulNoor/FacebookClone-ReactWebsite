import Feeds from "./Components/Feeds";
import Header from "./Components/Header";
import LSidebar from "./Components/LSidebar";
import RSidebar from "./Components/RSidebar";

function App() {
  return (
    <div className="App">
      {/* Header */}
      <Header />

      <div className="app_body">
        <LSidebar />
        <Feeds />
        <RSidebar />
      </div>

      {/* Body */}
      {/* Left Sidebar */}
      {/* Posts */}
      {/* Right Sidebar */}
    </div>
  );
}

export default App;
