import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WorkshopPage = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("/api/classes");
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch workshops", err);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Workshops</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((workshop) => (
          <Link
            to={`/workshops/${workshop._id}`}
            key={workshop._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{workshop.title}</h2>
            <p className="text-sm text-gray-600">{workshop.instructor}</p>
            <p className="mt-2 text-gray-700">{workshop.description.slice(0, 80)}...</p>
            <p className="mt-2 font-medium">€{workshop.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkshopPage;
