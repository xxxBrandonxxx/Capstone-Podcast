import React, { useEffect, useState } from "react";
import SeasonSelector from "../seasonSelector/SeasonSelector";
import MoonLoader from "react-spinners/MoonLoader";
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

  // Fetch a specific show's data from the API, and show on DOM
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        console.info("Show SPinnenr")
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${show}`
        ).then((data) => {
          console.info("DataHasbeen fetched")
        });
        console.info("hideSpinner")
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

          {selectedSeasonData && (
            <>
              <h4 className="selected-season-title">
                {selectedSeasonData.title}
              </h4>
              <p className="season-episodes">
                Episodes: {selectedSeasonData.episodes.length}
              </p>
              <ul className="episode-list">
                {selectedSeasonData.episodes.map((episode) => (
                  <li key={episode.episode} className="episode-item">
                    <span className="episode-number-pill">
                      EPISODE: {episode.episode}
                    </span>
                    <h5 className="episode-title">{episode.title}</h5>
                    {episodeIsFavorited(episode) ? (
                      <button
                        className="favourite-button"
                        onClick={() =>
                          toggleFavorite(episode, selectedSeasonData, showData)
                        }
                      >
                        favourite
                      </button>
                    ) : (
                      <button
                        className="favourite-button"
                        onClick={() =>
                          toggleFavorite(episode, selectedSeasonData, showData)
                        }
                      >
                        add to favourite
                      </button>
                    )}
                    <p className="episode-description">{episode.description}</p>
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
