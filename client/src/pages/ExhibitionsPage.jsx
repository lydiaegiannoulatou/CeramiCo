import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("http://localhost:3050/exhibitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExhibitions(res.data);
    } catch (err) {
      console.error("Error fetching exhibitions:", err);
      setError("Could not load exhibitions");
      toast.error("Failed to fetch exhibitions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  if (loading) return <div className="text-center py-10">Loading exhibitions...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Exhibitions</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => (
          <Link
            key={exhibition._id}
            to={`/exhibitions/${exhibition._id}`}
            className="border rounded-xl overflow-hidden hover:shadow-md transition duration-200 block"
          >
            <img
              src={exhibition.media[0]}
              alt={exhibition.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{exhibition.title}</h2>
              <p className="text-gray-600 text-sm">
                {exhibition.description.slice(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionsPage;
