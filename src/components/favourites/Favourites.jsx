import React, { useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { format } from "date-fns";
import { AiFillHeart } from "react-icons/ai";
import "./Favourites.css";

const Favourites = ({ favoriteEpisodeIDs, toggleFavorite, playEpisode }) => {
  // State
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  // State for the episode sorting
  const [sortBy, setSortBy] = useState("");

  // Fetch favorite episodes data from the composite key that is saved in favorites. Made from show ID, season number, and episode number
  useEffect(() => {
    const fetchFavoriteEpisodes = async () => {
      const episodes = [];

      // Loop through composite keys in favorites array
      for (let episode of favoriteEpisodeIDs) {
        // Break up composite key into individual parts
        const episodeIDs = episode.compositeKey.split("-");
        const showID = episodeIDs[0];
        const seasonID = episodeIDs[1];
        const episodeID = episodeIDs[2];

        // Fetch and store show data in state
        try {
          const response = await fetch(
            `https://podcast-api.netlify.app/id/${showID}`
          );
          const data = await response.json();
          const seasonData = data.seasons.find(
            (season) => season.season === parseInt(seasonID)
          );

          // Build object for favorite data
          const favObject = {
            key: episode.compositeKey,
            show: data,
            season: seasonData,
            episode: seasonData.episodes.find(
              (episode) => episode.episode === parseInt(episodeID)
            ),
            dateAdded: episode.timeStamp,
          };

          episodes.push(favObject);
        } catch (error) {
          console.error(
            "Issue fetching this show's details. Please try again.",
            error
          );
        }
      }
      setFavoriteEpisodes(episodes);
    };

    fetchFavoriteEpisodes();
  }, [favoriteEpisodeIDs]);

  // Format the display of Updated field data of a show into a human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM, yyyy");
  };

  // Sorting logic
  const applySorting = () => {
    let sortedEpisodes = [...favoriteEpisodes];

    if (sortBy === "titleAsc") {
      sortedEpisodes.sort((a, b) =>
        a.episode.title.localeCompare(b.episode.title)
      );
    } else if (sortBy === "titleDesc") {
      sortedEpisodes.sort((a, b) =>
        b.episode.title.localeCompare(a.episode.title)
      );
    } else if (sortBy === "recent") {
      sortedEpisodes.sort(
        (a, b) => new Date(b.show.updated) - new Date(a.show.updated)
      );
    } else if (sortBy === "leastRecent") {
      sortedEpisodes.sort(
        (a, b) => new Date(a.show.updated) - new Date(b.show.updated)
      );
    }

    setFavoriteEpisodes(sortedEpisodes);
  };

  useEffect(() => {
    applySorting();
  }, [sortBy]);

  // Loading Spinner
  if (!favoriteEpisodes) {
    return (
      <div className="loading-spinner">
        <MoonLoader color="#1b7ae4" loading={loading} size={60} />
      </div>
    );
  }

  return (
    <div>
      <h2>Favorite Episodes</h2>
      {favoriteEpisodes.length === 0 && <h1>No favorite episodes found.</h1>}
      <div className="sorting-fav-options">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Choose:</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recent">Most Recent Updated</option>
          <option value="leastRecent">Least Recent Updated</option>
        </select>
      </div>
      <ul className="episode-list">
        {favoriteEpisodes.map((favorite) => (
          <div key={favorite.key} className="episode-item">
            <h5 className="episode-fav-title">{favorite.episode.title}</h5>
            <h6 className="show-title">{favorite.show.title}</h6>
            <h6 className="selected-season-title">
              Season: {favorite.season.season}
            </h6>
            <button
              onClick={() =>
                toggleFavorite(
                  favorite.episode,
                  favorite.season,
                  favorite.show
                )
              }
            >
              Remove from fav
            </button>
            <p className="episode-description">
              {favorite.episode.description}
            </p>
            <p>Added to Favs: {formatDate(favorite.dateAdded)}</p>
            <p>Updated: {formatDate(favorite.show.updated)}</p>
            <button
              className="play-button"
              onClick={() => playEpisode(favorite.episode)}
            >
              Play
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Favourites;
