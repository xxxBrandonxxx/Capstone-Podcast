import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./Player.css";

const Player = () => {
  const selectedEpisode = useSelector((state) => state.player.selectedEpisode);
  const audioRef = useRef(null);

  useEffect(() => {
    if (selectedEpisode) {
      audioRef.current.src = selectedEpisode.file;
      audioRef.current.play();
    }
  }, [selectedEpisode]);

  const handleBeforeUnload = (e) => {
    if (audioRef.current && !audioRef.current.paused) {
      e.preventDefault();
      e.returnValue = ""; // This is required for Chrome compatibility
      return ""; // This is required for other browsers compatibility
    }
  };

  useEffect(() => {
    const handleUnload = (e) => {
      if (audioRef.current && !audioRef.current.paused) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to close the player?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  if (!selectedEpisode) {
    return null;
  }

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
