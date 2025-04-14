import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import OrderSummary from './OrderSummary';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });

      axios
        .get(`http://localhost:3050/orders/user/${user.id}`)
        .then(res => {
          setOrders(res.data.orders);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user orders:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    axios
      .put(`http://localhost:3050/users/${user.id}`, formData)
      .then(() => setEditing(false))
      .catch(err => console.error("Error updating profile:", err));
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete(`http://localhost:3050/users/${user.id}`)
        .then(() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        })
        .catch(err => console.error("Error deleting account:", err));
    }
  };

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">👤 Your Profile</h1>

      {editing ? (
        <div className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={handleCancel} className="ml-2 text-gray-600">
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEdit} className="text-blue-500 underline">
            Edit Info
          </button>
        </div>
      )}

      <hr className="my-6" />

      <button
        onClick={handleDeleteAccount}
        className="text-red-500 hover:underline"
      >
        🗑️ Delete Account
      </button>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4">📦 Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map(order => <OrderSummary key={order._id} order={order} />)
      )}
    </div>
  );
};

export default UserProfile;
