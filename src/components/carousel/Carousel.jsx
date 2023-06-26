import React from 'react';
import Slider from 'react-slick';
import './Carousel.css';

// Component for rendering a carousel of shows
export default function ShowCarousel({ shows, onShowClick }) {
  // Settings for the carousel
  const carouselSettings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop through slides infinitely
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 5, // Number of slides to show at once
    slidesToScroll: 3, // Number of slides to scroll at once
    responsive: [
      {
        // Breakpoint for smaller screens
        breakpoint: 768,
        settings: {
          slidesToShow: 8, // Adjust the number of slides for smaller screens
        },
      },
    ],
  };

  // Render the show carousel
  return (
    <Slider {...carouselSettings} className="show-carousel">
      {/* Map through each show */}
      {shows.map((show) => (
        <div key={show.id} className="carousel-slide" onClick={() => onShowClick(show.id)}>
          <img className="carousel-image" src={show.image} alt={show.title} />
          <div className="show-details">
            <h3 className="show-title">{show.title}</h3>
            <p className="show-seasons">Seasons: {show.seasons}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
}
