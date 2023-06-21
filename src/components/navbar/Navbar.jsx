import React from 'react'; // Import React
import logo from '/images/podcast-logos.jpg'; // Import the podcast logo image
import './Navbar.css'; // Import the Navbar CSS file

export default function Navbar({ onFavoritesClick, viewingFavorites }) {
  // Render the navbar component
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <img className="navbar-logo" src={logo} alt="Podcast Logo" />
        <h1>Welcome to Brandon's podcast</h1>

        {/* Button to toggle between favorites and back */}
        <button onClick={onFavoritesClick}>
          {viewingFavorites ? 'Back' : 'Favourites'}
        </button>
      </div>
    </nav>
  );
}
