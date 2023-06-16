import React from "react";
import "./SeasonSelector.css";

const SeasonSelector = ({ seasons, selectedSeason, onSelectSeason }) => {
  return (
    <div className="season-selector">
      <label htmlFor="season-select">Select the Season:</label>
      <select
        id="season-select"
        value={selectedSeason}
        onChange={(event) => onSelectSeason(parseInt(event.target.value))}
      >
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