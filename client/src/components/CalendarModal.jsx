import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Calendar from "./Calendar";

const CalendarModal = ({ isOpen, onClose, sessions, selectedSession, onSelectSession, onConfirm }) => {
  const handleConfirm = () => {
    if (selectedSession) {
      onConfirm(selectedSession);
      onClose();
    }
  };

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

          <Calendar
            sessions={sessions}
            onSelectSession={onSelectSession}
          />

          {selectedSession && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <p><strong>Date:</strong> {new Date(selectedSession.start).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedSession.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Available Spots:</strong> {selectedSession.availableSpots}</p>
              <button
                onClick={handleConfirm}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Selection
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CalendarModal;
