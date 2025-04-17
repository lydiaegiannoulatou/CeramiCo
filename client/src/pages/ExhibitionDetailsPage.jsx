import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import axios from "axios";

const ExhibitionDetailsPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExhibition = async () => {
        const token = localStorage.getItem("token")
      try {
        const res = await axios.get(`http://localhost:3050/exhibitions/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
              }
        );
        setExhibition(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load exhibition.", err);
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading exhibition...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!exhibition) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Main Image */}
      {exhibition.media?.length > 0 && (
  <div className="mb-6">
    <ImageCarousel images={exhibition.media} />
  </div>
)}


      {/* Title and Dates */}
      <h1 className="text-4xl font-bold mb-2">{exhibition.title}</h1>
      <p className="text-gray-600 mb-4">
        {new Date(exhibition.startDate).toLocaleDateString()} –{" "}
        {new Date(exhibition.endDate).toLocaleDateString()}
      </p>

      {/* Location */}
      {exhibition.location && (
        <p className="text-md text-gray-700 italic mb-6">Location: {exhibition.location}</p>
      )}

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About the Exhibition</h2>
        <p className="text-gray-800 leading-relaxed">{exhibition.description}</p>
      </div>

      {/* Participants */}
      {exhibition.participants?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exhibition.participants.map((participant, index) => (
              <div key={index} className="flex items-start space-x-4">
                {participant.profileImage && (
                  <img
                    src={participant.profileImage}
                    alt={participant.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{participant.name}</p>
                  {participant.role && (
                    <p className="text-sm text-gray-600">{participant.role}</p>
                  )}
                  {participant.bio && (
                    <p className="text-sm text-gray-700 mt-1">{participant.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {exhibition.tags?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {exhibition.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetailsPage;
