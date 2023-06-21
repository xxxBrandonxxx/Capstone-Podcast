// Import the necessary dependencies
import React from 'react';
import './SeasonSelector.css'; // Import the SeasonSelector CSS file

// SeasonSelector component to display and select seasons
const SeasonSelector = ({ seasons, selectedSeason, onSelectSeason }) => {
  // Event handler for season change
  const handleSeasonChange = (event) => {
    const seasonValue = parseInt(event.target.value); // Get the selected season value
    onSelectSeason(seasonValue); // Call the provided callback function with the selected season
  };

  // Render the SeasonSelector component
  return (
    <div className="season-selector">
      {/* Season selection label */}
      <label className="season-selector-label" htmlFor="season-select">
        Choose a Season:
      </label>

      {/* Season selection dropdown */}
      <select
        className="season-selector-select"
        id="season-select"
        value={selectedSeason}
        onChange={handleSeasonChange}
      >
        {/* Map over each season and create an option for each */}
        {seasons.map((season) => (
          <option key={season.season} value={season.season}>
            {season.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;
