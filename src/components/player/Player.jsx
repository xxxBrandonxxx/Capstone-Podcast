import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./Player.css";

const Player = () => {
  // Get the selectedEpisode from the Redux store
  const selectedEpisode = useSelector((state) => state.player.selectedEpisode);

  // Create a reference for the audio element
  const audioRef = useRef(null);

  // useEffect hook to handle changes in the selectedEpisode
  useEffect(() => {
    // If a selectedEpisode exists
    if (selectedEpisode) {
      // Set the audio source to the selected episode's file
      audioRef.current.src = selectedEpisode.file;
      // Play the audio
      audioRef.current.play();
    }
  }, [selectedEpisode]);

  // If no selectedEpisode is available, return null to render nothing
  if (!selectedEpisode) {
    return null;
  }

  // Render the player component with the selectedEpisode information
  return (
    <div className="player-container">
      <div className="player">
        <h2>{selectedEpisode.title}</h2>
        <p>{selectedEpisode.description}</p>
        <audio id="audioPlayer" ref={audioRef} controls autoPlay />
      </div>
    </div>
  );
};

export default Player;
