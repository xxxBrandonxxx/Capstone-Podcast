import React, { useEffect, useRef } from 'react'; // Import React and other necessary dependencies
import { useSelector } from 'react-redux'; // Import the useSelector hook from react-redux
import './Player.css'; // Import the Player CSS file

const Player = () => {
  // Get the selected episode from the Redux store
  const selectedEpisode = useSelector((state) => state.player.selectedEpisode);

  // Create a reference to the audio element
  const audioRef = useRef(null);

  // Update the audio source and play when the selected episode changes
  useEffect(() => {
    if (selectedEpisode) {
      audioRef.current.src = selectedEpisode.file;
      audioRef.current.play();
    }
  }, [selectedEpisode]);

  // If no episode is selected, return null
  if (!selectedEpisode) {
    return null;
  }

  // Render the player component
  return (
    <div className="player-container">
      <div className="player">
        {/* Display the selected episode's title and description */}
        <h2>{selectedEpisode.title}</h2>
        <p>{selectedEpisode.description}</p>

        {/* Audio player */}
        <audio id="audioPlayer" ref={audioRef} controls />
      </div>
    </div>
  );
};

export default Player;
