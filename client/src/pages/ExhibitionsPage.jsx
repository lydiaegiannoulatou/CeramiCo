import React from 'react';

const exhibitions = [
  {
    title: "Earth & Flame",
    description: "A curated collection of modern raku pottery inspired by fire and transformation.",
    image: "https://via.placeholder.com/150", // Replace with real image
  },
  {
    title: "Forms of Nature",
    description: "An exhibition exploring organic textures and natural glazes in contemporary ceramics.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Clay & Culture",
    description: "Featuring traditional pottery styles from around the world, reinterpreted by local artists.",
    image: "https://via.placeholder.com/150",
  },
];

const ExhibitionsPage = () => {
  return (
    <div className="bg-[#fdf8f1] min-h-screen py-12 px-4 sm:px-8 md:px-16">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10 text-[#2f2f2f]">
        Our Exhibitions
      </h1>

      <div className="space-y-8">
        {exhibitions.map((exhibit, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg border border-gray-300 p-4 flex flex-col md:flex-row gap-4"
          >
            <img
              src={exhibit.image}
              alt={exhibit.title}
              className="w-full md:w-48 h-48 object-cover rounded border border-gray-200 bg-[#f3ead7]"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#4b3b2a] mb-2">{exhibit.title}</h2>
                <p className="text-gray-700 mb-4">{exhibit.description}</p>
              </div>
              <a
                href="#"
                className="text-sm text-[#8b4513] hover:underline self-start"
              >
                Read more ...
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionsPage;
