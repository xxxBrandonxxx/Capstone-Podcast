import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Carousel from "../carousel/Carousel";
import MoonLoader from "react-spinners/MoonLoader";
import { format } from "date-fns";
import "./ShowList.css";

function ShowList({ onShowClick }) {
  // State variables
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleShows, setVisibleShows] = useState(12);
  const [sortBy, setSortBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [carouselShows, setCarouselShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch shows data on component mount
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        const data = await response.json();
        setShows(data);
        setLoading(false);
        setCarouselShows(data.slice(0, visibleShows));
      } catch (error) {
        console.error(
          "Issue fetching shows data. Please refresh and try again.",
          error
        );
      }
    };

    fetchShows();
  }, []);

  // Update carousel shows and filter based on filterValue and visibleShows
  useEffect(() => {
    const filteredShows = shows.filter(
      (show) =>
        show.title.toLowerCase().includes(filterValue.toLowerCase()) &&
        !carouselShows.find((carouselShow) => carouselShow.id === show.id)
    );
    const shuffledShows = filteredShows.sort(() => 0.5 - Math.random());
    setCarouselShows(shuffledShows.slice(0, visibleShows));
  }, [shows, filterValue, visibleShows]);

  // Sort shows based on sortBy value
  useEffect(() => {
    let sortedShows = [...shows];

    if (sortBy === "titleAsc") {
      sortedShows.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "titleDesc") {
      sortedShows.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "recent") {
      sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (sortBy === "leastRecent") {
      sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    }

    setShows(sortedShows);
  }, [sortBy]);

  // Handle click on show card
  const handleShowClick = (showId) => {
    onShowClick(showId);
    setCarouselShows((prevCarouselShows) =>
      prevCarouselShows.filter((show) => show.id !== showId)
    );
  };

  // Load more shows
  const handleLoadMore = async () => {
    setLoadingMore(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVisibleShows((prevVisibleShows) => prevVisibleShows + 8);
      setLoading(false);
    } catch (error) {
      console.error("Issue fetching additional shows. Please refresh.", error);
    }

    setLoadingMore(false);
  };

  // Function to truncate text
  const clampText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  // Format the display of Updated field data of a show into a human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM, yyyy");
  };

  // Mapping of genre IDs to genre titles
  const genreMapping = {
    1: "Personal Growth",
    2: "Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

  // Get genre titles based on genre IDs
  const getGenreTitles = (genreIds) => {
    return genreIds.map((genreId) => (
      <span className="genre-pill" key={genreId}>
        {genreMapping[genreId]}
      </span>
    ));
  };

  // Configuration for fuzzy searching using Fuse.js library
  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 0.3,
  };

  // Create a new instance of Fuse with shows and fuseOptions
  const fuse = new Fuse(shows, fuseOptions);

  // Perform search based on input value
  const searchShows = (value) => {
    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const results = fuse.search(value.trim()).map((result) => result.item);
      setSearchResults(results);
    }
  };

  // Render loading spinner while shows are being fetched
  if (loading) {
    return (
      <div className="loading-spinner">
        <h1>Loading</h1>
        <div>
        <MoonLoader color="#1b7ae4"  loading={loading} size={60} />
        </div>
      </div>
    );
  }

  return (
    <div className="show-list-container">
      <div className="interested-in-text">You may be interested in...</div>
      <Carousel shows={carouselShows} onShowClick={onShowClick} />
      <div className="available-shows-text">Check out our available shows!</div>
      <div className="sorting-options">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Choose:</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recent">Most Recent Updated</option>
          <option value="leastRecent">Least Recent Updated</option>
        </select>
      </div>

      <div className="Search-Bars">
        Search:
        <input
          type="text"
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            searchShows(e.target.value);
          }}
          placeholder="Filter by title"
        />
      </div>
      <div className="show-list">
        {(filterValue.trim() === "" ? shows : searchResults)
          .slice(0, visibleShows)
          .map((show) => (
            <div
              className="show-card"
              key={show.id}
              onClick={() => handleShowClick(show.id)}
            >
              <img className="show-image" src={show.image} alt={show.title} />
              <div className="show-details">
                <h3 className="show-title">{show.title}</h3>
                <p className="show-seasons">Seasons: {show.seasons}</p>
                <p className="show-description">
                  {clampText(show.description, 100)}
                </p>
                <div className="genre-container">
                  <span className="genre-label">Genres</span>
                  <div className="genre-list">
                    <p className="show-genres">
                      {getGenreTitles(show.genres)}
                    </p>
                  </div>
                </div>
                <p className="last-updated">
                  Updated: {formatDate(show.updated)}
                </p>
              </div>
            </div>
          ))}
      </div>

      {loadingMore ? (
        <div className="loading-spinner">
        <h1>Loading</h1>
        <div>
        <MoonLoader color="#1b7ae4" loading={loading} size={60} />
        </div>
      </div>
      ) : (
        visibleShows <
          (filterValue.trim() === "" ? shows.length : searchResults.length) && (
          <div className="load-more" onClick={handleLoadMore}>
            Load More
          </div>
        )
      )}
    </div>
  );
}

export default ShowList;
