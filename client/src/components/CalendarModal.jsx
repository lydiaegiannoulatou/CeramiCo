import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { isValid, format } from "date-fns"; // import isValid and format
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Day Grid plugin for month view
import interactionPlugin from "@fullcalendar/interaction"; // Plugin for selecting dates and events

const CalendarModal = ({ isOpen, onClose, sessions, selectedSession, onSelectSession, onConfirm }) => {
  // Guard against invalid selectedSession or missing start date
  const handleConfirm = () => {
    if (selectedSession) {
      onConfirm(selectedSession);
      onClose();
    }
  };

  if (!selectedSession) return null; // Early exit if there's no selected session
  
  const { start, availableSpots } = selectedSession;
  const startDate = new Date(start);

  // Check if the start date is valid
  const safeDate = isValid(startDate) ? format(startDate, "PP") : "Invalid Date";
  const safeTime = isValid(startDate) ? format(startDate, "p") : "Invalid Time";

  // FullCalendar events data mapping
  const events = sessions.map((session) => ({
    title: session.availableSpots > 0 ? "Available" : "Fully Booked",
    start: new Date(session.start),
    end: new Date(session.start),
    availableSpots: session.availableSpots,
    isFullyBooked: session.availableSpots === 0,
  }));

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-2xl font-bold">Select Date & Time</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-black">
              <X />
            </button>
          </div>

          {/* FullCalendar Integration */}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={(info) => {
              if (info.dateStr) {
                const clickedSession = sessions.find(
                  (session) => new Date(session.start).toISOString() === info.dateStr
                );
                if (clickedSession) {
                  onSelectSession(clickedSession); // Select session if clicked
                }
              }
            }}
            eventClick={(info) => {
              const clickedSession = sessions.find(
                (session) => new Date(session.start).toISOString() === info.event.startStr
              );
              if (clickedSession) {
                onSelectSession(clickedSession); // Select session if event clicked
              }
            }}
            selectable={true}
            editable={false}
          />

          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <p><strong>Date:</strong> {safeDate}</p>
            <p><strong>Time:</strong> {safeTime}</p>
            <p><strong>Available Spots:</strong> {availableSpots}</p>
            <button
              onClick={handleConfirm}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm Selection
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CalendarModal;
