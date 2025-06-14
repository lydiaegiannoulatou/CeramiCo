import React from "react";
import { Calendar, Mail, User, Clock } from "lucide-react";

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

  /* badge palette with earthy tones */
  const getBadgeClasses = (state) => {
    const baseClasses = "inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ring-1";
    const stateClasses = {
      pending: "bg-[#F5E6D3] text-[#8B4513] ring-[#8B4513]/20",
      confirmed: "bg-[#E2E8D5] text-[#3C685A] ring-[#3C685A]/20",
      canceled: "bg-[#F2D6D3] text-[#8B3E2F] ring-[#8B3E2F]/20",
      default: "bg-[#F5F2EB] text-[#2F4138] ring-[#2F4138]/20"
    };
    return `${baseClasses} ${stateClasses[state] || stateClasses.default}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return { date: formattedDate, time: formattedTime };
  };

  const sessionDateTime = formatDate(sessionDate);
  const bookingDateTime = formatDate(bookingDate);

  return (
    <section className="relative mx-auto max-w-4xl">
      <div className="rounded-2xl bg-white/95 p-8 backdrop-blur-sm shadow-sm border border-[#2F4138]/10">
        <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-40 w-40 rounded-full bg-[#3C685A]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-[#8B4513]/10 blur-3xl" />

        {/* heading */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-[#2F4138]">
            Booking Confirmation
          </h2>
          <span className={getBadgeClasses(status)}>{status}</span>
        </header>

        {/* workshop details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {workshopImage && (
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <img
                src={workshopImage}
                alt={workshopTitle}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#3C685A]" />
                  <p className="text-sm font-medium uppercase tracking-wide text-[#5C6760]">
                    Workshop
                  </p>
                </div>
                <h3 className="text-xl font-display text-[#2F4138]">{workshopTitle}</h3>
              </div>
              
              <div className="space-y-2">
                <Meta icon={Calendar} label="Session Date">
                  {sessionDateTime.date}
                </Meta>
                <Meta icon={Clock} label="Session Time">
                  {sessionDateTime.time}
                </Meta>
              </div>
              
              <Meta icon={Calendar} label="Booked On">
                {`${bookingDateTime.date} at ${bookingDateTime.time}`}
              </Meta>
            </div>
          </div>
        </div>

        {/* attendee details */}
        <div className="mt-10 pt-8 border-t border-[#2F4138]/10">
          <h3 className="font-display text-xl text-[#2F4138] mb-6">
            Attendee Details
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Meta icon={User} label="Name">
              {user?.name}
            </Meta>
            <Meta icon={Mail} label="Email">
              {user?.email}
            </Meta>
          </div>
        </div>
      </div>
    </section>
  );
};

/* meta component with icons */
const Meta = ({ icon: Icon, label, children }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-[#3C685A]" />}
      <p className="text-sm font-medium uppercase tracking-wide text-[#5C6760]">
        {label}
      </p>
    </div>
    <div className="text-[#2F4138] font-sans">{children}</div>
  </div>
);

export default BookingSummary;