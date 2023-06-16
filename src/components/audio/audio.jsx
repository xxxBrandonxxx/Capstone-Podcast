import React from 'react';

export default function AudioPlayer({ audioUrl }) {
  return (
    <div>{audioUrl}</div>
    // <audio controls>
    //   <source src={audioUrl} type="audio/mp3" />
    //   Your browser does not support the audio element.
    // </audio>
  );
}