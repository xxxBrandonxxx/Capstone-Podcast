import React, { useState } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedEpisode } from './store/actions/playerActions';

// Components
import Player from './components/player/Player';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import ShowDetails from './components/singleShowDetails/SingleShowDetails';
import ShowList from './components/showList/ShowList';
import Favourites from './components/favourites/Favourites';

import './App.css';

function App() {
  // State variables
  const [selectedShowId, setSelectedShowId] = useState(null); // Track the ID of the selected show
  const [viewingFavorites, setViewingFavorites] = useState(false); // Track whether the user is viewing favorites
  const [favoriteEpisodes, setFavoriteEpisodes] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteEpisodes');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }); // Track the favorite episodes

  const dispatch = useDispatch(); // Get the Redux dispatch function

  // Event handler for clicking on a show to view its details
  const handleShowClick = async (showId) => {
    setSelectedShowId(showId); // Set the selected show ID
  };

  // Event handler for the back button to return from the show's view
  const handleGoBack = () => {
    setSelectedShowId(null); // Reset the selected show ID
  };

  // Event handler for the favorites button click in the Navbar
  const handleFavoritesNavigation = () => {
    setViewingFavorites((prevState) => !prevState); // Toggle the viewingFavorites state
    setSelectedShowId(null); // Reset the selected show ID
  };

  // Toggle the favorite status of an episode
  const toggleFavorite = (episode, season, show) => {
    const compositeKey = `${show.id}-${season.season}-${episode.episode}`; // Create a unique composite key for the episode

    if (favoriteEpisodes.some((favEpisode) => favEpisode.compositeKey === compositeKey)) {
      removeFavorite(compositeKey); // Remove the episode from favorites if it exists
    } else {
      addFavorite(compositeKey); // Add the episode to favorites if it doesn't exist
    }
  };

  // Add selected episode to favorites
  const addFavorite = (compositeKey) => {
    const timeStamp = new Date();
    const favorite = {
      compositeKey: compositeKey,
      timeStamp: timeStamp,
    };
    const updatedFavorites = [...favoriteEpisodes, favorite];
    setFavoriteEpisodes(updatedFavorites); // Update the favorite episodes list in state
    localStorage.setItem('favoriteEpisodes', JSON.stringify(updatedFavorites)); // Store the updated favorites in localStorage
  };

  // Remove selected episode from favorites
  const removeFavorite = (compositeKey) => {
    const updatedFavorites = favoriteEpisodes.filter(
      (favEpisode) => favEpisode.compositeKey !== compositeKey
    );
    setFavoriteEpisodes(updatedFavorites); // Update the favorite episodes list in state
    localStorage.setItem('favoriteEpisodes', JSON.stringify(updatedFavorites)); // Store the updated favorites in localStorage
  };

  // Set the selected episode in the Redux store to play
  const playEpisode = (episode) => {
    dispatch(setSelectedEpisode(episode));
  };

  return (
    <div className="app">
      <Navbar
        onFavoritesClick={handleFavoritesNavigation} // Event handler for favorites button click
        viewingFavorites={viewingFavorites} // Pass whether the user is viewing favorites
      />
      <div className="content">
        {/* Render the appropriate component based on the state */}
        {viewingFavorites ? (
          <Favourites
            favoriteEpisodeIDs={favoriteEpisodes}
            toggleFavorite={toggleFavorite}
            playEpisode={playEpisode}
          />
        ) : selectedShowId ? (
          <ShowDetails
            show={selectedShowId}
            onGoBack={handleGoBack}
            toggleFavorite={toggleFavorite}
            favoriteEpisodes={favoriteEpisodes}
            playEpisode={playEpisode}
          />
        ) : (
          <ShowList onShowClick={handleShowClick} />
        )}
      </div>
      <Player />
      <Footer />
    </div>
  );
}

export default App;
