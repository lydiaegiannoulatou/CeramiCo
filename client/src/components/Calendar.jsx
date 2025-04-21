import React from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
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

const Calendar = ({ sessions, onSelectSession }) => {
  const events = sessions
    .filter((session) => session.start && !isNaN(new Date(session.start))) // Filter invalid sessions
    .map((session, index) => {
      const start = new Date(session.start);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
      return {
        id: index,
        title: session.availableSpots > 0 ? "Available" : "Fully Booked",
        start,
        end,
        availableSpots: session.availableSpots,
        isFullyBooked: session.availableSpots === 0,
      };
    });

  const defaultDate = events.length > 0 ? events[0].start : new Date();

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        popup
        defaultDate={defaultDate}
        onSelectEvent={(event) => {
          if (!event.isFullyBooked) {
            onSelectSession(event);
          } else {
            alert("This session is fully booked.");
          }
        }}
        style={{ height: 400 }}
        components={{
          event: ({ event }) => (
            <div
              className={`event-tooltip-wrapper ${
                event.isFullyBooked ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
              title={`Available Spots: ${event.availableSpots}`}
            >
              {event.title}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default Calendar;
