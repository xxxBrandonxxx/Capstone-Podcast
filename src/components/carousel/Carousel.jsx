import React from "react";
import Slider from "react-slick";
import "./Carousel.css";

export default function Carousel({ shows, onShowClick }) {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Number of slides to show at once
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 8, // Adjust the number of slides for smaller screens
        },
      },
    ],
  };

  return (
    <Slider {...carouselSettings} className="show-carousel">
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
