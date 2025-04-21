// components/Calendar.jsx
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
  const events = sessions.map((session, index) => {
    const start = new Date(session);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour
    return {
      id: index,
      title: "Workshop Session",
      start,
      end,
    };
  });

  return (
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={["month", "week", "day"]}
      popup
      onSelectEvent={onSelectSession}
      style={{ height: 300 }}
    />
  );
};

export default Calendar;
