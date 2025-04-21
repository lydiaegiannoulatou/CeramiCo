import React, { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import CalendarModal from "./CalendarModal";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const WorkshopCalendar = () => {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions"); // Replace with your API endpoint
        const data = await response.json();

        // Validate and filter sessions
        const validSessions = data.filter(
          (session) => session.start && !isNaN(new Date(session.start))
        );
        setSessions(validSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (session) => {
    console.log("Confirmed booking for:", session);
    alert(`You have booked: ${session.title} on ${session.start}`);
  };

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={sessions.map((session) => ({
          id: session.id,
          title: session.title,
          start: new Date(session.start),
          end: new Date(session.end),
          availableSpots: session.availableSpots,
        }))}
        style={{ height: "100%", padding: "1rem" }}
        onSelectEvent={handleSelectSession}
        views={["month", "week", "day"]}
        popup
      />

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessions={sessions}
        selectedSession={selectedSession} 
        onSelectSession={setSelectedSession}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default WorkshopCalendar;
