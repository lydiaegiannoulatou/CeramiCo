import React, { useEffect, useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const WorkshopCalendar = ({ onSelectClass }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes/calendar");
        const data = await response.json();

        const formattedEvents = data.map((cls) => ({
          id: cls.id,
          title: cls.title,
          start: new Date(cls.start),
          end: new Date(new Date(cls.start).getTime() + 60 * 60 * 1000), // Default 1h duration
          resource: cls.extendedProps,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleSelectEvent = (event) => {
    const { availableSpots } = event.resource;

    if (availableSpots <= 0) {
      alert("Sorry, this class is fully booked.");
      return;
    }

    const confirm = window.confirm(`Do you want to book "${event.title}" on ${event.start.toLocaleString()}?`);
    if (confirm) {
      onSelectClass(event.id);
    }
  };

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", padding: "1rem" }}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day"]}
        popup
      />
    </div>
  );
};

export default WorkshopCalendar;
