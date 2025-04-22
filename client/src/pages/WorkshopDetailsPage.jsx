import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3050/workshops/${id}`
        );
        setWorkshop(response.data);

        const available = response.data.sessions.filter(
          (session) => session.availableSpots > 0
        );
        setAvailableSessions(available);
      } catch (err) {
        console.error("Failed to fetch workshop", err);
      }
    };

    fetchWorkshop();
  }, [id]);

  const handleSelectTimeSlot = (session) => {
    setSelectedSession(session);
  };

  const handleBooking = () => {
    if (!selectedSession) {
      alert("Please select a time slot before booking.");
      return;
    }
  
    navigate(`/workshops/${workshop._id}/sessions/${selectedSession._id}`, {
      state: { workshop, selectedSession },
    });
  };

  if (!workshop) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-[#FAF7F1] min-h-screen">
      <h1 className="text-2xl font-serif mb-6 border-b pb-2">
        {workshop.title}
      </h1>

      <div className="bg-[#F0E6D2] h-64 rounded shadow mb-6 flex items-center justify-center text-gray-500">
        {workshop.image ? (
          <img
            src={workshop.image}
            alt={workshop.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          "Workshop Image"
        )}
      </div>

      <div className="bg-white p-6 rounded shadow mb-6 min-h-[150px]">
        <h2 className="text-lg font-serif mb-2">Workshop About</h2>
        <p className="text-gray-700">{workshop.description}</p>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-serif mb-4">Available Time Slots</h2>

        <ul className="list-none">
          {availableSessions.length === 0 ? (
            <p>No available time slots left.</p>
          ) : (
            availableSessions.map((session) => (
              <li
                key={session._id}
                className="cursor-pointer text-indigo-600 mb-2"
                onClick={() => handleSelectTimeSlot(session)}
              >
                {new Date(session.sessionDate).toLocaleDateString()} -{" "}
                {new Date(session.sessionDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                (Available spots: {session.availableSpots})
              </li>
            ))
          )}
        </ul>

        {selectedSession && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <p>
              <strong>Selected Date:</strong>{" "}
              {new Date(selectedSession.sessionDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Selected Time:</strong>{" "}
              {new Date(selectedSession.sessionDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Available Spots:</strong>{" "}
              {workshop.maxSpots - selectedSession.bookedSpots}
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleBooking}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
