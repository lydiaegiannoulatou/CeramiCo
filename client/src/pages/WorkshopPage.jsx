import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkshopPage = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get("http://localhost:3050/workshops");
        setClasses(response.data);
      } catch (err) {
        console.error("Failed to fetch workshops", err);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Workshops
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((workshop) => (
          <Link
            to={`/workshops/${workshop._id}`}
            key={workshop._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col"
          >
            {workshop.image && (
              <img
                src={workshop.image}
                alt={workshop.title}
                className="h-40 w-full object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{workshop.title}</h2>
            <p className="text-sm text-gray-600">{workshop.instructor}</p>
            <p className="mt-2 text-gray-700">
              {workshop.description.length > 80
                ? `${workshop.description.slice(0, 80)}...`
                : workshop.description}
            </p>
            <p className="mt-2 font-medium text-blue-600">€{workshop.price}</p>
          </Link>
        ))}
      </div>
      <div className="text-center space-y-4 mt-8">
        <button
          onClick={() => navigate("/calendar")}
          className="inline-block rounded border border-indigo-600 px-6 py-2 text-indigo-600 transition hover:bg-indigo-50"
        >
          See full calendar
        </button>
      </div>
    </div>
  );
};

export default WorkshopPage;
