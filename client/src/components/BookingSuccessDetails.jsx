import React from "react";
import clsx from "clsx";

const BookingSummary = ({ booking }) => {
  if (!booking) return null;

  const {
    workshopTitle,
    workshopImage,
    sessionDate,
    status,
    bookingDate,
    user,
  } = booking;

  /* badge palette */
  const badge = (state) =>
    clsx(
      "inline-block rounded-full px-3 py-0.5 text-xs font-medium ring-1",
      {
        pending:  "bg-yellow-50 text-yellow-700 ring-yellow-300",
        confirmed:"bg-emerald-50 text-emerald-700 ring-emerald-300",
        canceled: "bg-rose-50 text-rose-700 ring-rose-300",
      }[state] || "bg-gray-100 text-gray-600 ring-gray-300"
    );

  return (
    <section className="relative mx-auto max-w-4xl rounded-3xl bg-white/70 p-8 backdrop-blur-lg">
      {/* decorative blob */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-40 w-40 -translate-x-1/3 -translate-y-1/3 rounded-full bg-rose-500/10 blur-3xl" />

      {/* heading */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">
          Booking&nbsp;Confirmation
        </h2>
        <span className={badge(status)}>{status}</span>
      </header>

      {/* workshop details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {workshopImage && (
          <img
            src={workshopImage}
            alt={workshopTitle}
            className="h-64 w-full rounded-2xl object-cover"
          />
        )}

        <div className="flex flex-col gap-6">
          <Meta label="Workshop">{workshopTitle}</Meta>
          <Meta label="Session Date">
            {new Date(sessionDate).toLocaleString()}
          </Meta>
          <Meta label="Booked On">
            {new Date(bookingDate).toLocaleString()}
          </Meta>
        </div>
      </div>

      {/* user */}
      <h3 className="mt-12 mb-4 text-lg font-semibold tracking-tight text-gray-700">
        Attendee
      </h3>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <Meta label="Name">{user?.name}</Meta>
        <Meta label="Email">{user?.email}</Meta>
      </div>
    </section>
  );
};

/* tiny sub‑component for labels */
const Meta = ({ label, children }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="text-gray-800">{children}</p>
  </div>
);

export default BookingSummary;