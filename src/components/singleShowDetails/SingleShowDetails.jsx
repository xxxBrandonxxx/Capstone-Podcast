import React, { useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import Fuse from "fuse.js";
import SeasonSelector from "../seasonSelector/SeasonSelector";
import "./SingleShowDetails.css";

export default function ShowDetails({
  show,
  onGoBack,
  toggleFavorite,
  favoriteEpisodes,
  playEpisode,
}) {
  // States
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedSeasonData, setSelectedSeasonData] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch a specific show's data from the API, and show on DOM
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${show}`
        );
        const data = await response.json();
        setShowData(data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Issue fetching this show's details. Please try again.",
          error
        );
      }
    };

    fetchShowDetails();
  }, [show]);

  // Once show's data available, find the seasons of that show
  useEffect(() => {
    if (showData) {
      const seasonData = showData.seasons.find(
        (season) => season.season === selectedSeason
      );
      setSelectedSeasonData(seasonData);
    }
  }, [selectedSeason, showData]);

  // Handles the selection of a season's data in a show, and sets it to state
  const handleSelectSeason = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    if (showData) {
      const seasonData = showData.seasons.find(
        (season) => season.season === seasonNumber
      );
      setSelectedSeasonData({ ...seasonData });
    }
  };

  // Checks if an episode is in favorites, by using the composite key made from show ID, season number, and episode number
  // Used to determine if the button should be filled or not
  const episodeIsFavorited = (episode) => {
    const compositeKey = `${showData.id}-${selectedSeasonData.season}-${episode.episode}`;
    const episodeInFavorites = favoriteEpisodes.some(
      (favEpisode) => favEpisode.compositeKey === compositeKey
    );
    return episodeInFavorites;
  };

  // Fuse.js options and initialization
  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 0.3,
  };

  const fuse = new Fuse(selectedSeasonData?.episodes || [], fuseOptions);

  // Search episodes based on filter value
  const searchEpisodes = (value) => {
    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const results = fuse.search(value.trim()).map((result) => result.item);
      setSearchResults(results);
    }
  };

  // Show loading spinner while loading shows data
  if (!showData) {
    return (
      <div className="loading-spinner">
        <MoonLoader color="#1b7ae4" loading={loading} size={60} />
      </div>
    );
  }

  // Destructure the field data of a show
  const { title, description, seasons } = showData;

  // Gets the season image and appends to DOM when selecting a season
  const selectedSeasonImage =
    seasons.find((season) => season.season === selectedSeason)?.image ||
    showData.image;

  return (
    <div className="single-show-details">
      {showData && (
        <div>
          <button className="go-back-btn" onClick={onGoBack}>
            Go Back
          </button>
          <h3 className="show-title">{title}</h3>
          <img
            className="single-show-image"
            src={selectedSeasonImage}
            alt={title}
          />
          <p className="show-description">{description}</p>

          <SeasonSelector
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSelectSeason={handleSelectSeason}
          />

          <input className="Search-episodes-bar"
            type="text"
            placeholder="Search episodes"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              searchEpisodes(e.target.value);
            }}
          />

          {selectedSeasonData && (
            <>
              <h4 className="selected-season-title">
                {selectedSeasonData.title}
              </h4>
              <p className="season-episodes">
                Episodes: {selectedSeasonData.episodes.length}
              </p>
              <ul className="episode-list">
                {filterValue.trim() === ""
                  ? selectedSeasonData.episodes.map((episode) => (
                      <li key={episode.episode} className="episode-item">
                        <span className="episode-number-pill">
                          EPISODE: {episode.episode}
                        </span>
                        <h5 className="episode-title">{episode.title}</h5>
                        {episodeIsFavorited(episode) ? (
                          <button
                            className="favourite-button"
                            onClick={() =>
                              toggleFavorite(
                                episode,
                                selectedSeasonData,
                                showData
                              )
                            }
                          >
                            favourite
                          </button>
                        ) : (
                          <button
                            className="favourite-button"
                            onClick={() =>
                              toggleFavorite(
                                episode,
                                selectedSeasonData,
                                showData
                              )
                            }
                          >
                            add to favourite
                          </button>
                        )}
                        <p className="episode-description">
                          {episode.description}
                        </p>
                        <button
                          className="play-button"
                          onClick={() => playEpisode(episode)}
                        >
                          Play
                        </button>
                      </li>
                    ))
                  : searchResults.map((episode) => (
                      <li key={episode.episode} className="episode-item">
                        <span className="episode-number-pill">
                          EPISODE: {episode.episode}
                        </span>
                        <h5 className="episode-title">{episode.title}</h5>
                        {episodeIsFavorited(episode) ? (
                          <button
                            className="favourite-button"
                            onClick={() =>
                              toggleFavorite(
                                episode,
                                selectedSeasonData,
                                showData
                              )
                            }
                          >
                            favourite
                          </button>
                        ) : (
                          <button
                            className="favourite-button"
                            onClick={() =>
                              toggleFavorite(
                                episode,
                                selectedSeasonData,
                                showData
                              )
                            }
                          >
                            add to favourite
                          </button>
                        )}
                        <p className="episode-description">
                          {episode.description}
                        </p>
                        <button
                          className="play-button"
                          onClick={() => playEpisode(episode)}
                        >
                          Play
                        </button>
                      </li>
                    ))}
              </ul>
            </>
          )}

          <button className="go-back-btn" onClick={onGoBack}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
