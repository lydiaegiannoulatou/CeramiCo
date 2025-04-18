import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full">
      {/* Image Container */}
      <div className="relative w-full h-[400px] overflow-hidden group">
        <div className="w-full h-full relative">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`carousel-${idx}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-between z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="text-white text-3xl hover:text-gray-300 ml-4"
          >
            <IoIosArrowBack />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="text-white text-3xl hover:text-gray-300 mr-4"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center gap-4">
    {/* Image Count */}
<div className=" text-center text-sm text-white bg-black/60 inline-block px-3 py-1 rounded mx-auto">
  {currentIndex + 1}/{images.length}
</div>

{/* See Full Image Button */}
<div className=" inline-block ml-4">
  <button
    onClick={openModal}
    className="text-black underline hover:text-gray-300 transition"
  >
    See Full Image
  </button>
</div>
</div>


      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="absolute inset-0" onClick={closeModal}></div>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50 hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <IoIosArrowBack />
          </button>

          <img
            src={images[currentIndex]}
            alt={`Zoomed ${currentIndex}`}
            className="max-w-[90vw] max-h-[90vh] z-40 rounded-lg shadow-lg"
          />

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50 hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <IoIosArrowForward />
          </button>

          <button
            className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-red-400"
            onClick={closeModal}
          >
            &times;
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm z-50">
            {currentIndex + 1}/{images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
