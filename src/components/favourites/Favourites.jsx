import React, { useEffect, useState } from 'react'; // Import React and the necessary hooks
import MoonLoader from 'react-spinners/MoonLoader'; // Import the MoonLoader component from react-spinners
import { format } from 'date-fns'; // Import the format function from date-fns
import { AiFillHeart } from 'react-icons/ai'; // Import the AiFillHeart icon from react-icons

const Favourites = ({ favoriteEpisodeIDs, toggleFavorite, playEpisode }) => {
  // State for favorite episodes
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  // State for episode sorting
  const [sortBy, setSortBy] = useState('');
  // State for typed filtering
  const [filterValue, setFilterValue] = useState('');

  // Fetch favorite episodes data based on the composite key from favorites
  useEffect(() => {
    const fetchFavoriteEpisodes = async () => {
      const episodes = [];

      // Loop through composite keys in favorites array
      for (let episode of favoriteEpisodeIDs) {
        // Split composite key into individual parts
        const episodeIDs = episode.compositeKey.split('-');
        const showID = episodeIDs[0];
        const seasonID = episodeIDs[1];
        const episodeID = episodeIDs[2];

        // Fetch and store show data in state
        try {
          const response = await fetch(`https://podcast-api.netlify.app/id/${showID}`);
          const data = await response.json();
          const seasonData = data.seasons.find((season) => season.season === parseInt(seasonID));

          // Build object for favorite data
          const favObject = {
            key: episode.compositeKey,
            show: data,
            season: seasonData,
            episode: seasonData.episodes.find((episode) => episode.episode === parseInt(episodeID)),
            dateAdded: episode.timeStamp,
          };

          episodes.push(favObject);
        } catch (error) {
          console.error('Issue fetching show details. Please try again.', error);
        }
      }

      setFavoriteEpisodes(episodes);
    };

    fetchFavoriteEpisodes();
  }, [favoriteEpisodeIDs]);

  // Format the display of updated field data of a show into a human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM, yyyy');
  };

  // Apply sorting logic based on the selected sorting option
  const applySorting = () => {
    let sortedEpisodes = [...favoriteEpisodes];

    if (sortBy === 'titleAsc') {
      sortedEpisodes.sort((a, b) => a.episode.title.localeCompare(b.episode.title));
    } else if (sortBy === 'titleDesc') {
      sortedEpisodes.sort((a, b) => b.episode.title.localeCompare(a.episode.title));
    } else if (sortBy === 'recent') {
      sortedEpisodes.sort((a, b) => new Date(b.show.updated) - new Date(a.show.updated));
    } else if (sortBy === 'leastRecent') {
      sortedEpisodes.sort((a, b) => new Date(a.show.updated) - new Date(b.show.updated));
    }

    setFavoriteEpisodes(sortedEpisodes);
  };

  useEffect(() => {
    applySorting();
  }, [sortBy]);

  // Render a loading spinner if favorite episodes are not available yet
  if (!favoriteEpisodes) {
    return (
      <div className="loading-spinner">
        <MoonLoader color="#1b7ae4" loading={loading} size={60} />
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome to your Favourites</h2>
      <div className="sorting-options">
        <label htmlFor="sortBy">Sort By:</label>
        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Choose:</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recent">Most Recent Updated</option>
          <option value="leastRecent">Least Recent Updated</option>
        </select>
      </div>
      {favoriteEpisodes &&
        favoriteEpisodes.map((favorite) => (
          <div key={favorite.key}>
            <h2>{favorite.episode.title}</h2>
            <h3>{favorite.show.title}</h3>
            <h4>Season: {favorite.season.season}</h4>
            <p>{favorite.episode.description}</p>
            <p>Added to Favs: {formatDate(favorite.dateAdded)}</p>
            <p>Updated: {formatDate(favorite.show.updated)}</p>
            {/* Add any other relevant information here */}
            <button className="play-button" onClick={() => playEpisode(favorite.episode)}>
              Play
            </button>
            <button onClick={() => toggleFavorite(favorite.episode, favorite.season, favorite.show)}>
              <AiFillHeart />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Favourites;
