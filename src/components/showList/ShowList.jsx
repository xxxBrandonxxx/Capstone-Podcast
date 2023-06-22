// Import the necessary dependencies
import React, { useState, useEffect } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import { format } from 'date-fns';
import './ShowList.css'; // Import the ShowList CSS file

// ShowList component to display a list of shows
export default function ShowList({ onShowClick }) {
  // State for shows data
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading state
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more shows
  const [visibleShows, setVisibleShows] = useState(8); // State for visible shows
  const [sortBy, setSortBy] = useState(''); // State for sorting option
  const [filterValue, setFilterValue] = useState(''); // State for filtering

  // Fetch the show's data from the API and update the state
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        const data = await response.json();
        setShows(data);
        setLoading(false);
      } catch (error) {
        console.error('Issue fetching shows data. Please refresh and try again.', error);
      }
    };

    fetchShows();
  }, []);

  // Apply sorting logic based on selected sort option
  const applySorting = () => {
    let sortedShows = [...shows];

    if (sortBy === 'titleAsc') {
      sortedShows.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'titleDesc') {
      sortedShows.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'recent') {
      sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (sortBy === 'leastRecent') {
      sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    }

    setShows(sortedShows);
  };

  // Apply sorting when the sort option changes
  useEffect(() => {
    applySorting();
    setVisibleShows(18); // Reset visible shows when sorting changes
  }, [sortBy]);

  // Handle click on a specific show
  const handleShowClick = (showId) => {
    onShowClick(showId);
  };

  // Handle loading more shows when the load more button is clicked
  const handleLoadMore = async () => {
    setLoadingMore(true);

    try {
      // Simulate API delay to show loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Increase visible shows by 8
      setVisibleShows((prevVisibleShows) => prevVisibleShows + 8);
      setLoading(false);
    } catch (error) {
      console.error('Issue fetching additional shows. Please refresh.', error);
    }

    setLoadingMore(false); // Set loading state to false once the data has been fetched
  };

  // Shorten the text and add ellipsis if it exceeds the maximum length
  const clampText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  // Format the date string into a human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM, yyyy');
  };

  // Map genres to their titles
  const genreMapping = {
    1: 'Personal Growth',
    2: 'Investigative Journalism',
    3: 'History',
    4: 'Comedy',
    5: 'Entertainment',
    6: 'Business',
    7: 'Fiction',
    8: 'News',
    9: 'Kids and Family',
  };

  // Get genre titles for a show
  const getGenreTitles = (genreIds) => {
    return genreIds.map((genreId) => (
      <span className="genre-pill" key={genreId}>
        {genreMapping[genreId]}
      </span>
    ));
  };

  // Render the ShowList component
  return (
    <div className="show-list-container">
      {/* Sorting options */}
      <div className="sorting-options">
        <label className="Fields" htmlFor="sortBy">Filter:</label>
        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Choose:</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recent">Most Recent Updated</option>
          <option value="leastRecent">Least Recent Updated</option>
        </select>
        </div>
        <div className='search-barr'>
        Search:
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Filter by title"
        />
      </div>

      {/* Show list */}
      <div className="show-list">
        {shows
          .filter((show) => show.title.toLowerCase().includes(filterValue.toLowerCase()))
          .slice(0, visibleShows)
          .map((show) => (
            <div className="show-card" key={show.id} onClick={() => handleShowClick(show.id)}>
              <img className="show-image" src={show.image} alt={show.title} />
              <div className="show-details">
                <h3 className="show-title">{show.title}</h3>
                <p className="show-seasons">Seasons: {show.seasons}</p>
                <p className="show-description">{clampText(show.description, 100)}</p>
                <div className="genre-container">
                  <span className="genre-label">Genres</span>
                  <div className="genre-list">
                    <p className="show-genres">{getGenreTitles(show.genres)}</p>
                  </div>
                </div>
                <p className="last-updated">Updated: {formatDate(show.updated)}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Loading spinner or load more button */}
      {loadingMore ? (
        <div className="loading-spinner">
          <MoonLoader color="#1b7ae4" loading={true} size={60} />
        </div>
      ) : (
        visibleShows < shows.length && (
          <div className="load-more-container">
            <button className="load-more-button" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )
      )}
    </div>
  );
}
