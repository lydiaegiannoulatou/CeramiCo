import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { endOfDay, isBefore } from "date-fns";

import CalendarModal from "../components/CalendarModal";

const WorkshopCalendar = () => {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  /* fetch future sessions with open spots */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3050/workshops/sessions");
        const data = await res.json();
        const now = new Date();

        setSessions(
          Array.isArray(data)
            ? data.filter(
                (s) =>
                  s.start &&
                  !isNaN(new Date(s.start)) &&
                  isBefore(now, endOfDay(new Date(s.start))) &&
                  s.availableSpots > 0
              )
            : []
        );
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    })();
  }, []);

  /* click existing session */
  const handleEventClick = ({ event }) => {
    setSelectedSession(event.extendedProps);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[80vh] p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={sessions}
        eventClick={handleEventClick}
        height="100%"
      />

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSession={selectedSession}
      />
    </div>
  );
};

export default WorkshopCalendar;
