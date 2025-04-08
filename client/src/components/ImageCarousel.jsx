import React, { useState } from "react";
import { IoArrowForwardCircle, IoArrowBackCircle  } from "react-icons/io5";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler for moving to the next image
  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); 
    }
  };

  // Handler for moving to the previous image
  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1); 
    }
  };

  return (
    <div className="carousel-container">
      {/* Image display */}
      <div className="image-container">
        <img src={images[currentIndex]} alt={`product-image-${currentIndex}`} className="carousel-image" />
      </div>

      {/* Arrows and index count */}
      <div className="controls-container flex justify-center">
        <button onClick={prevImage} className="arrow-button"><IoArrowBackCircle /></button>
        <div className="image-count">
          {currentIndex + 1}/{images.length}
        </div>
        <button onClick={nextImage} className="arrow-button"><IoArrowForwardCircle /></button>
      </div>
    </div>
  );
};

export default ImageCarousel;
