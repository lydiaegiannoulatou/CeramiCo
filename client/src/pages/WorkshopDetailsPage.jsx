import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
const locales = { "en-US": enUS };
import CalendarModal from "../components/CalendarModal";
import AddToCart from "../components/AddToCart";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(`http://localhost:3050/workshops/${id}`);
        setWorkshop(response.data);
      } catch (err) {
        console.error("Failed to fetch workshop", err);
      }
    };

    fetchWorkshop();
  }, [id]);

  if (!workshop) return <p className="text-center mt-10">Loading...</p>;

  const events = workshop.sessions.map((session, index) => {
    const start = new Date(session);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return {
      id: index,
      title: workshop.title,
      start,
      end,
    };
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-[#FAF7F1] min-h-screen">
      <h1 className="text-2xl font-serif mb-6 border-b pb-2">{workshop.title}</h1>

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

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="bg-gray-200 rounded p-4 flex-1 min-h-[250px] shadow">
        <button
  onClick={() => setModalOpen(true)}
  className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
>
  Select Date & Time
</button>

{selectedSession && (
  <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
    <p><strong>Selected Date:</strong> {selectedSession.start.toLocaleDateString()}</p>
    <p><strong>Selected Time:</strong> {selectedSession.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
)}

<CalendarModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  sessions={workshop.sessions}
  onConfirm={(session) => setSelectedSession(session)}
/>

        </div>

        <div className="bg-gray-200 rounded p-4 w-full lg:w-1/3 min-h-[250px] shadow flex items-center justify-center text-center">
          <div>
            <h2 className="font-serif mb-2">Time slot<br />and<br />date verification</h2>
            {/* Placeholder - Replace with actual selection logic */}
            <p className="text-gray-600">Feature coming soon</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className="bg-[#D2AE82] hover:bg-[#b79467] text-white py-2 px-6 rounded shadow text-sm font-medium"
          onClick={() => alert("Booking functionality coming soon!")}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
