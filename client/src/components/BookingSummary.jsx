const BookingSummary = ({ booking }) => {
    if (!booking) return null;
  
    const { 
      workshopTitle,
      workshopImage,
      sessionDate,
      status,
      bookingDate,
      user 
    } = booking;
  
    return (
      <div className="max-w-2xl mx-auto border p-6 rounded-lg shadow-lg bg-white mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Booking Confirmation</h2>
        
        {/* Workshop details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Workshop Details</h3>
          <div className="mt-2">
            <p className="text-lg font-medium text-gray-900"><strong>Workshop:</strong> {workshopTitle}</p>
            {workshopImage && (
              <img src={workshopImage} alt={workshopTitle} className="mt-4 rounded-lg shadow-md w-full h-64 object-cover" />
            )}
          </div>
        </div>
  
        {/* Session and Booking Date */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Session Information</h3>
          <div className="mt-2">
            <p className="text-lg text-gray-900"><strong>Session Date:</strong> {new Date(sessionDate).toLocaleString()}</p>
            <p className="text-lg text-gray-900"><strong>Status:</strong> {status}</p>
            <p className="text-lg text-gray-900"><strong>Booking Date:</strong> {new Date(bookingDate).toLocaleString()}</p>
          </div>
        </div>
  
        {/* User details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700">User Details</h3>
          <div className="mt-2">
            <p className="text-lg text-gray-900"><strong>Name:</strong> {user?.name}</p>
            <p className="text-lg text-gray-900"><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookingSummary;
  