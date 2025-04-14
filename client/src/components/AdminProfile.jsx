import React from 'react';

const AdminProfile = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* All Orders */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
        {/* You can fetch and list all orders here */}
        <p>Loading all orders for review...</p>
      </div>

      {/* Newsletter */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Send Newsletter</h3>
        <textarea
          rows="4"
          className="w-full border p-2 rounded"
          placeholder="Write your message here..."
        ></textarea>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Send to Subscribers</button>
      </div>
    </div>
  );
};

export default AdminProfile;
