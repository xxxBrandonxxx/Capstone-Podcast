import { useState } from "react";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Header from "./components/header/header";
import ShowDetails from "./components/singleShowDetails/SingleShowDetails";
import ShowList from "./components/showList/ShowList";
import "./App.css";

function App() {
  const [selectedShowId, setSelectedShowId] = useState(null);
  
  const handleShowClick = (showId) => {
    setSelectedShowId(showId);
  };

  const handleGoBack = () => {
    setSelectedShowId(null);
  };

  return (
    <div className="app">
      <Header />
      <Navbar />
      <div className="content">
        {selectedShowId ? (
          <ShowDetails show={selectedShowId} onGoBack={handleGoBack} />
        ) : (
          <ShowList onShowClick={handleShowClick} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
