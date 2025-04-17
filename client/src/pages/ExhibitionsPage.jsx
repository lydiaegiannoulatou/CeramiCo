import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminExhibitionModal from "../components/AdminExhibitionModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";

  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("http://localhost:3050/exhibitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExhibitions(res.data);
    } catch (err) {
      console.error("Error fetching exhibitions:", err);
      setError("Could not load exhibitions");
      toast.error("Failed to fetch exhibitions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleOpenModal = () => {
    setSelectedExhibition(null);  // Ensure that when opening for a new exhibition, selectedExhibition is null
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedExhibition(null);
    setIsModalOpen(false);
  };

  const handleExhibitionCreated = () => {
    fetchExhibitions();  // Fetch the latest list after creating or updating
    handleCloseModal();
    toast.success("Exhibition saved successfully!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exhibition?")) return;

    try {
      await axios.delete(`http://localhost:3050/exhibitions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExhibitions();
      toast.success("Exhibition deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete exhibition.");
    }
  };

  const handleUpdate = (exhibition) => {
    setSelectedExhibition(exhibition);  // Set selected exhibition when updating
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-10">Loading exhibitions...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-center w-full">Exhibitions</h1>
        {isAdmin && (
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ml-4 whitespace-nowrap"
          >
            Add New Exhibition
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => (
          <div
            key={exhibition._id}
            className="border rounded-xl overflow-hidden hover:shadow-md transition duration-200 relative flex flex-col"
          >
            <Link to={`/exhibitions/${exhibition._id}`} className="flex-1">
              <img
                src={exhibition.media[0]}
                alt={exhibition.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{exhibition.title}</h2>
                <p className="text-gray-600 text-sm">
                  {exhibition.description.slice(0, 100)}...
                </p>
              </div>
            </Link>

            {isAdmin && (
              <div className="flex justify-end gap-2 p-3 mt-auto">
                <button
                  onClick={() => handleUpdate(exhibition)}  // Call handleUpdate when updating
                  className="border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-100 transition text-sm flex items-center gap-1"
                >
                  <RxUpdate />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(exhibition._id)}
                  className="border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-100 transition text-sm flex items-center gap-1"
                >
                  <RiDeleteBin6Line />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AdminExhibitionModal
          onClose={handleCloseModal}
          onExhibitionCreated={handleExhibitionCreated}  // Function to call after update/create
          existingData={selectedExhibition}  // Pass selected exhibition for update
        />
      )}
    </div>
  );
};

export default ExhibitionsPage;
