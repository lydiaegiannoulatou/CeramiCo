import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";

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

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`/api/classes/${id}`);
        const data = await response.json();
        setWorkshop(data);
      } catch (err) {
        console.error("Failed to fetch workshop", err);
      }
    };

    fetchWorkshop();
  }, [id]);

  if (!workshop) return <p className="text-center mt-10">Loading...</p>;

  const event = {
    id: workshop._id,
    title: workshop.title,
    start: new Date(workshop.date),
    end: new Date(new Date(workshop.date).getTime() + 60 * 60 * 1000),
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
      <p className="text-gray-600 mb-2">Instructor: {workshop.instructor}</p>
      <p className="mb-4 text-gray-700">{workshop.description}</p>
      <p className="font-semibold text-lg mb-6">Price: €{workshop.price}</p>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Next Available Date</h2>
        <Calendar
          localizer={localizer}
          events={[event]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          views={["month", "week", "day"]}
          popup
        />
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
