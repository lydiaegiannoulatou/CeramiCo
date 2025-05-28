import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from "lucide-react";

const ImageCarousel = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % Math.max(images.length, 1));
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));

  const openModal = () => {
    if (images.length > 0) {
      setIsModalOpen(true);
      document.body.style.overflow = "hidden";
    }
  };
  
  const closeModal = () => {
  setIsModalOpen(false);
  document.body.style.overflow = "auto";
  if (onClose) onClose();
};


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleImageLoad = (idx) => {
    setLoadedImages(prev => ({
      ...prev,
      [idx]: true
    }));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage();
    }
    if (touchStart - touchEnd < -50) {
      prevImage();
    }
  };

  return (
    <div className="w-full">
      <div 
        className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-md group bg-[#f1e8d8]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#8a7563]">
            <ZoomIn size={48} strokeWidth={1.5} />
            <p className="mt-3 text-lg">No Images Available</p>
          </div>
        ) : (
          <div className="w-full h-full relative cursor-pointer" onClick={openModal}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={img}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad(idx)}
                  style={{ opacity: loadedImages[idx] ? 1 : 0 }}
                />
                {!loadedImages[idx] && idx === currentIndex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f1e8d8]">
                    <div className="w-10 h-10 border-2 border-[#5b3b20] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}

            <button
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-[#5b3b20]" />
            </button>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-[#5b3b20] transition-all duration-300 z-20 opacity-0 group-hover:opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#5b3b20]/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-[#5b3b20] transition-all duration-300 z-20 opacity-0 group-hover:opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#5b3b20]/50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-center text-xs font-medium bg-[#f1e8d8] text-[#5b3b20] px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full scrollbar-thin scrollbar-thumb-[#d3c5b0] scrollbar-track-transparent">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden transition-all duration-300 ${
                    idx === currentIndex
                      ? "border-[#5b3b20] shadow-md scale-105"
                      : "border-[#d3c5b0] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      )}

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors duration-300"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 z-50 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  className="absolute right-4 z-50 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              src={images[currentIndex]}
              alt={`Full view ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain select-none"
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-50">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;