import React, { useEffect, useState } from 'react';
import SeasonSelector from '../seasonSelector/SeasonSelector';
import Spinner from 'react-spinners/MoonLoader';
import AudioPlayer from '../audio/audio'; // Import the AudioPlayer component
import './SingleShowDetails.css';

export default function ShowDetails({ show, onGoBack }) {
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedSeasonData, setSelectedSeasonData] = useState(null);

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

  useEffect(() => {
    if (showData) {
      const seasonData = showData.seasons.find(
        (season) => season.season === selectedSeason
      );
      setSelectedSeasonData(seasonData);
    }
  }, [selectedSeason, showData]);

  const handleSelectSeason = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
  };

  if (!showData) {
    return (
      <div className="loading-spinner">
        <Spinner color="#1b7ae4" loading={loading} size={60} />
      </div>
    );
  }

  const { title, description, seasons, image } = showData;

  return (
    <div className="single-show-details">
      <button className="go-back-btn" onClick={onGoBack}>
        Go Back
      </button>
      <div>
        <h3 className="show-title">{title}</h3>
        <img className="single-show-image" src={image} alt={title} />
        <p className="show-description">{description}</p>

        <SeasonSelector
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSelectSeason={handleSelectSeason}
        />

        {selectedSeasonData && (
          <div>
            <h4 className="selected-season-title">
              {selectedSeasonData.title}
            </h4>
            <ul className="episode-list">
              {selectedSeasonData.episodes.map((episode) => (
                <li key={episode.episode} className="episode-item">
                  <span className="episode-number-pill">
                    EPISODE: {episode.episode}
                  </span>
                  <h5 className="episode-title">{episode.title}</h5>
                  <p className="episode-description">{episode.description}</p>
                  <audio controls>
                    <source src="../../public/assets/audio/placeholder-audio.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="go-back-btn" onClick={onGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
}
